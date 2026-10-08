import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { mkdirSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";
import { DatabaseSync } from "node:sqlite";

const root = fileURLToPath(new URL(".", import.meta.url));
const distDir = join(root, "dist");
const dataDir = join(root, "data");
mkdirSync(dataDir, { recursive: true });
const databasePath = process.env.DB_PATH || join(dataDir, "supernova.sqlite");
mkdirSync(dirname(databasePath), { recursive: true });
const db = new DatabaseSync(databasePath);
db.exec(`CREATE TABLE IF NOT EXISTS parent_access_requests (
  id TEXT PRIMARY KEY,
  parent_email TEXT NOT NULL,
  student_email TEXT NOT NULL,
  approve_token_hash TEXT NOT NULL UNIQUE,
  deny_token_hash TEXT NOT NULL UNIQUE,
  parent_status_token_hash TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending',
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  decided_at TEXT,
  decision_ip TEXT
)`);
db.exec(`CREATE TABLE IF NOT EXISTS student_course_progress (
  request_id TEXT NOT NULL,
  course_key TEXT NOT NULL,
  course_title TEXT NOT NULL,
  completed_modules INTEGER NOT NULL DEFAULT 0,
  total_modules INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT,
  PRIMARY KEY (request_id, course_key),
  FOREIGN KEY (request_id) REFERENCES parent_access_requests(id)
)`);

const PORT = Number(process.env.PORT || 4173);
const OWNER_EMAIL = process.env.OWNER_EMAIL || "samarthkalani0@gmail.com";
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${OWNER_EMAIL}`;
const TOKEN_TTL_MS = 48 * 60 * 60 * 1000;
const COURSE_PROGRESS = [
  ["money-basics", "Money Basics", 3],
  ["budget-builder", "Budget Builder", 3],
  ["investment-starter", "Investment Starter", 4],
  ["money-and-family", "Money and Family", 1],
];

const hash = (value) => crypto.createHash("sha256").update(value).digest("hex");
const token = () => crypto.randomBytes(32).toString("base64url");
const json = (res, status, body) => { res.writeHead(status, { "Content-Type": "application/json", "Cache-Control": "no-store" }); res.end(JSON.stringify(body)); };
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));

async function readBody(req) {
  let raw = "";
  for await (const chunk of req) raw += chunk;
  if (raw.length > 20000) throw new Error("Request too large");
  return JSON.parse(raw || "{}");
}

async function sendNotification({ subject, message, cc }) {
  if (process.env.DISABLE_EMAILS === "1") {
    console.log(`[email disabled] ${subject} -> ${cc || OWNER_EMAIL}`);
    console.log(`[local simulation message]\n${message}`);
    return;
  }
  const body = new URLSearchParams({ name: "SuperNova consent system", email: OWNER_EMAIL, message, _subject: subject, _template: "table", _captcha: "false" });
  if (cc) body.set("_cc", cc);
  const response = await fetch(FORM_ENDPOINT, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" }, body });
  const raw = await response.text();
  let result = null;
  try { result = JSON.parse(raw); } catch { /* FormSubmit may return non-JSON HTML on activation/error. */ }
  if (!response.ok || (result && (result.success === false || result.success === "false"))) {
    const detail = result?.message || `Email service returned ${response.status}`;
    throw new Error(detail);
  }
}

function baseUrl(req) {
  const configured = String(process.env.PUBLIC_BASE_URL || "").trim();
  const isPlaceholder = !configured || /your[-_]?domain|your[-_]?service|localhost|127\.0\.0\.1/i.test(configured);
  const host = String(req.headers.host || "");
  const fallbackProto = req.headers["x-forwarded-proto"] || (/^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(host) ? "http" : "https");
  const origin = isPlaceholder ? `${fallbackProto}://${host}` : configured;
  return origin.replace(/\/$/, "");
}

async function handleApi(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/health") {
    return json(res, 200, { ok: true, service: "supernova", database: databasePath, emailDestination: OWNER_EMAIL });
  }
  if (req.method === "POST" && url.pathname === "/api/access-request") {
    let requestId = null;
    try {
      const input = await readBody(req);
      const parentEmail = String(input.parentEmail || "").trim().toLowerCase();
      const studentEmail = String(input.studentEmail || "").trim().toLowerCase();
      if (!/^\S+@\S+\.\S+$/.test(parentEmail) || !/^\S+@\S+\.\S+$/.test(studentEmail) || parentEmail === studentEmail) return json(res, 400, { error: "Enter two different valid email addresses." });
      const approve = token(); const deny = token(); const parentStatus = token();
      const id = crypto.randomUUID(); requestId = id; const created = new Date(); const expires = new Date(created.getTime() + TOKEN_TTL_MS);
      db.prepare("INSERT INTO parent_access_requests (id,parent_email,student_email,approve_token_hash,deny_token_hash,parent_status_token_hash,status,expires_at,created_at) VALUES (?,?,?,?,?,?,?,?,?)").run(id, parentEmail, studentEmail, hash(approve), hash(deny), hash(parentStatus), "pending", expires.toISOString(), created.toISOString());
      const progressInsert = db.prepare("INSERT INTO student_course_progress (request_id,course_key,course_title,total_modules) VALUES (?,?,?,?)");
      for (const [courseKey, courseTitle, totalModules] of COURSE_PROGRESS) progressInsert.run(id, courseKey, courseTitle, totalModules);
      const origin = baseUrl(req);
      const approveUrl = `${origin}/api/consent/${approve}?decision=approve`;
      const denyUrl = `${origin}/api/consent/${deny}?decision=deny`;
      const statusUrl = `${origin}/?parent-status=${parentStatus}`;
      const message = `A parent access request was submitted.\n\nParent email: ${parentEmail}\nStudent registered email: ${studentEmail}\n\nThe student must choose one of these links within 48 hours:\nAPPROVE ACCESS: ${approveUrl}\nDENY ACCESS: ${denyUrl}\n\nParent status link: ${statusUrl}\n\nThe parent view stays locked until the student approves. Do not forward these links.`;
      await sendNotification({ subject: "SuperNova: student consent required for parent access", message, cc: studentEmail });
      return json(res, 201, { ok: true, status: "pending", parentStatusToken: parentStatus, expiresAt: expires.toISOString() });
    } catch (error) {
      if (requestId) {
        db.prepare("DELETE FROM student_course_progress WHERE request_id=?").run(requestId);
        db.prepare("DELETE FROM parent_access_requests WHERE id=?").run(requestId);
      }
      console.error(error);
      return json(res, 502, { error: `The request could not be sent. ${error instanceof Error ? error.message : "Check FormSubmit activation and try again."}` });
    }
  }

  const consentMatch = url.pathname.match(/^\/api\/consent\/([A-Za-z0-9_-]+)$/);
  if (req.method === "GET" && consentMatch) {
    const action = url.searchParams.get("decision");
    const column = action === "approve" ? "approve_token_hash" : action === "deny" ? "deny_token_hash" : null;
    if (!column) return json(res, 400, { error: "Invalid decision." });
    const request = db.prepare(`SELECT * FROM parent_access_requests WHERE ${column} = ?`).get(hash(consentMatch[1]));
    if (!request) return consentPage(res, "Link not valid", "This consent link is invalid or has already been used.", false);
    if (request.status !== "pending") return consentPage(res, `Already ${request.status}`, `This request was already ${request.status}. No further action is needed.`, false);
    if (new Date(request.expires_at) < new Date()) { db.prepare("UPDATE parent_access_requests SET status='expired' WHERE id=? AND status='pending'").run(request.id); return consentPage(res, "Link expired", "This consent link expired after 48 hours. Please ask the parent to submit a new request.", false); }
    const status = action === "approve" ? "approved" : "denied";
    db.prepare("UPDATE parent_access_requests SET status=?, decided_at=?, decision_ip=? WHERE id=? AND status='pending'").run(status, new Date().toISOString(), req.socket.remoteAddress || "unknown", request.id);
    try { await sendNotification({ subject: `SuperNova: parent access ${status}`, message: `The student has ${status} the parent access request.\n\nParent email: ${request.parent_email}\nStudent email: ${request.student_email}\n\nThe parent status page will update automatically.`, cc: request.parent_email }); } catch (error) { console.error("Decision notification failed", error); }
    return consentPage(res, status === "approved" ? "Parent access approved" : "Parent access denied", status === "approved" ? "The parent has been notified. Their portal will unlock only for this approved request." : "The parent has been notified and the portal will remain locked.", true);
  }

  if (req.method === "GET" && url.pathname === "/api/parent-status") {
    const value = url.searchParams.get("token");
    if (!value) return json(res, 400, { error: "Missing status token." });
    const request = db.prepare("SELECT status, expires_at, decided_at FROM parent_access_requests WHERE parent_status_token_hash=?").get(hash(value));
    if (!request) return json(res, 404, { error: "Status link not found." });
    return json(res, 200, { status: request.status, expiresAt: request.expires_at, decidedAt: request.decided_at });
  }
  if (req.method === "GET" && url.pathname === "/api/parent-dashboard") {
    const value = url.searchParams.get("token");
    if (!value) return json(res, 400, { error: "Missing status token." });
    const request = db.prepare("SELECT id,status,student_email,decided_at FROM parent_access_requests WHERE parent_status_token_hash=?").get(hash(value));
    if (!request) return json(res, 404, { error: "Dashboard token not found." });
    if (request.status !== "approved") return json(res, 403, { error: "Parent dashboard is available only after student approval.", status: request.status });
    const courses = db.prepare("SELECT course_key as courseKey, course_title as title, completed_modules as completedModules, total_modules as totalModules, updated_at as updatedAt FROM student_course_progress WHERE request_id=? ORDER BY rowid").all(request.id);
    return json(res, 200, { status: request.status, studentEmail: request.student_email, approvedAt: request.decided_at, courses });
  }
  return json(res, 404, { error: "Not found" });
}

function consentPage(res, title, message, success) {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
  res.end(`<!doctype html><title>${escapeHtml(title)} · SuperNova</title><style>body{margin:0;background:#f4efe8;color:#292426;font:18px system-ui;display:grid;place-items:center;min-height:100vh}.card{max-width:620px;margin:20px;padding:48px;background:#fffaf5;box-shadow:0 20px 70px #29242622}h1{font:500 58px Georgia;line-height:.95}em{color:#d85b48}p{line-height:1.7;color:#756b68}a{display:inline-block;margin-top:16px;padding:14px 20px;border-radius:99px;background:#d85b48;color:white;text-decoration:none;font-size:13px}</style><main class="card"><small>SUPERNOVA / STUDENT CONSENT</small><h1>${escapeHtml(title)}</h1><p>${escapeHtml(message)}</p><a href="/">Return to SuperNova</a></main>`);
}

async function serve(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  if (url.pathname.startsWith("/api/")) return handleApi(req, res, url);
  let pathname = url.pathname === "/" ? "/index.html" : url.pathname;
  const file = join(distDir, pathname);
  try { const info = await stat(file); if (!info.isFile()) throw new Error("not file"); const content = await readFile(file); const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp" }; res.writeHead(200, { "Content-Type": types[extname(file)] || "application/octet-stream" }); res.end(content); } catch { const content = await readFile(join(distDir, "index.html")); res.writeHead(200, { "Content-Type": "text/html" }); res.end(content); }
}

createServer((req, res) => serve(req, res).catch((error) => { console.error(error); json(res, 500, { error: "Internal server error" }); })).listen(PORT, "0.0.0.0", () => console.log(`SuperNova full-stack server listening on ${PORT}`));
