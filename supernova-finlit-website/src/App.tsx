import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpen,
  Check,
  ChevronDown,
  CircleDollarSign,
  GraduationCap,
  Menu,
  MessageCircle,
  Play,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  X,
  Zap,
} from "lucide-react";
import "./styles.css";

type Course = {
  level: string;
  title: string;
  description: string;
  lessons: string[];
  accent: string;
  age: string;
};

const courses: Course[] = [
  {
    level: "01 · Start here",
    title: "Money Basics",
    description: "Build a clear first relationship with money — earning, saving, needs, wants and the cost of convenience.",
    lessons: ["Money mindset", "Needs vs wants", "Saving systems"],
    accent: "coral",
    age: "Ages 11–13",
  },
  {
    level: "02 · Build the habit",
    title: "Budget Builder",
    description: "Turn everyday UPI spending into a simple weekly system that makes choices visible without making life boring.",
    lessons: ["Weekly budgets", "Spending tracker", "UPI habits"],
    accent: "gold",
    age: "Ages 12–16",
  },
  {
    level: "03 · Grow the lens",
    title: "Investment Starter",
    description: "Learn what investing actually means, how risk works and how to spot confident-sounding misinformation online.",
    lessons: ["Risk & return", "Investment options", "Scam signals"],
    accent: "blue",
    age: "Ages 14–19",
  },
  {
    level: "04 · Make it real",
    title: "Money and Family",
    description: "Explore how money can support the people around us — giving back responsibly, making thoughtful family choices and turning financial confidence into care.",
    lessons: ["Giving responsibly", "Family money choices", "Reflection log"],
    accent: "ink",
    age: "Gold course · Module 11",
  },
];

const topicVideos = [
  { number: "01", title: "Money Fundamentals & Mindset", subtitle: "Needs, wants & the psychology of spending", image: "/thumbnails/topic-01-money-fundamentals.webp", color: "coral", track: "Money Basics" },
  { number: "02", title: "Budgeting & Cash Flow", subtitle: "Build a system for income, expenses & goals", image: "/thumbnails/topic-02-budgeting-cash-flow.webp", color: "gold", track: "Budget Builder" },
  { number: "03", title: "Digital Payments & Banking", subtitle: "UPI, accounts, statements & safe payments", image: "/thumbnails/topic-03-digital-payments-banking.webp", color: "blue", track: "Money Basics" },
  { number: "04", title: "Saving & Compounding", subtitle: "Make time and interest work together", image: "/thumbnails/topic-04-saving-compounding.webp", color: "plum", track: "Budget Builder" },
  { number: "05", title: "Credit & Debt", subtitle: "Understand credit before easy EMIs decide for you", image: "/thumbnails/topic-05-credit-debt.webp", color: "coral", track: "Budget Builder" },
  { number: "06", title: "Investing Basics", subtitle: "Risk, return, diversification & hype", image: "/thumbnails/topic-06-investing-basics.webp", color: "gold", track: "Investment Starter" },
  { number: "07", title: "Fraud, Scams & Cybersecurity", subtitle: "Spot red flags before they cost you", image: "/thumbnails/topic-07-fraud-scams-cybersecurity.webp", color: "blue", track: "Investment Starter" },
  { number: "08", title: "Taxes & Formal Income", subtitle: "Payslips, stipends & freelance basics", image: "/thumbnails/topic-08-taxes-formal-income.webp", color: "plum", track: "Investment Starter" },
  { number: "09", title: "Insurance & Risk Protection", subtitle: "The basics of cover, claims & health", image: "/thumbnails/topic-09-insurance-risk-protection.webp", color: "coral", track: "Investment Starter" },
  { number: "10", title: "Career & Income Planning", subtitle: "Connect choices today to earning potential", image: "/thumbnails/topic-10-career-income-planning.webp", color: "gold", track: "Investment Starter" },
  { number: "11", title: "Ethical & Social Money Topics", subtitle: "Family responsibility, giving & peer pressure", image: "/thumbnails/topic-11-ethical-social-money.webp", color: "blue", track: "Money and Family" },
]; 

const topicTracks = ["Money Basics", "Budget Builder", "Investment Starter", "Money and Family"];

const problemStats = [
  { value: "93%", label: "said school did not teach enough personal finance", detail: "The gap is structural, not motivational." },
  { value: "57%", label: "do not set budgets or track their spending", detail: "Good intentions need a practical system." },
];

const solutionBlocks = [
  { number: "01", title: "Verified curriculum", text: "Short, structured lessons on budgeting, saving, UPI discipline and investing basics, built with certified financial educators — not influencers.", icon: ShieldCheck },
  { number: "02", title: "Interactive practice", text: "A budget and UPI spending simulator lets teens practice real decisions, not just watch or read about them.", icon: BarChart3 },
  { number: "03", title: "Near-peer mentorship", text: "College students and lightly older teens create a relatable, low-pressure learning environment.", icon: Users },
  { number: "04", title: "School integration", text: "A school-aligned add-on keeps financial education rooted in existing timetables and teacher support.", icon: GraduationCap },
  { number: "05", title: "Gamified learning", text: "Points, badges and leaderboards make progress feel like a game — not a chore.", icon: Zap },
  { number: "06", title: "Parent dashboard", text: "A light companion view shares progress, simulation results and weekly habits without giving parents the steering wheel.", icon: Target },
  { number: "07", title: "Regional language support", text: "Lessons in Hindi, Gujarati, Tamil and more make the program relevant beyond English-first classrooms.", icon: MessageCircle },
  { number: "08", title: "Real money practice", text: "A supervised micro-wallet with a monthly cap makes discipline tangible beyond simulation.", icon: CircleDollarSign },
  { number: "09", title: "Section certification", text: "A certificate for every completed section gives learners a clear, useful record of practical money skills.", icon: BadgeCheck },
];

const sectionCertificates = topicVideos.map((topic) => ({
  section: topic.title,
  caption: `Complete section ${topic.number}`,
  detail: `Finish the ${topic.title.toLowerCase()} lessons, complete the practical activity and earn a verified SuperNova section certificate.`,
  color: topic.color,
  score: topic.number,
}));

function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    setVisible(window.localStorage.getItem("supernova-cookie-choice") === null);
    const openSettings = () => { setDetailsOpen(true); setVisible(true); };
    window.addEventListener("supernova-open-cookie-settings", openSettings);
    return () => window.removeEventListener("supernova-open-cookie-settings", openSettings);
  }, []);

  const chooseCookies = (choice: "essential" | "all") => {
    window.localStorage.setItem("supernova-cookie-choice", choice);
    setVisible(false);
  };

  if (!visible) return null;
  return <aside className="cookie-banner" role="dialog" aria-label="Cookie permission"><div><span className="section-label">YOUR PRIVACY</span><h2>Cookies, kept simple.</h2><p>We use essential browser storage to remember your preferences. Optional analytics cookies help us understand which parts of SuperNova are useful. You can choose either option.</p>{detailsOpen && <div className="cookie-details"><strong>Essential</strong><span>Required for preferences and basic site functionality.</span><strong>Optional analytics</strong><span>Helps us improve the experience using aggregated usage information. No sale of personal data.</span></div>}<button className="cookie-more" onClick={() => setDetailsOpen(!detailsOpen)}>{detailsOpen ? "Hide details" : "View details"}</button></div><div className="cookie-actions"><button className="button button-ink" onClick={() => chooseCookies("all")}>Allow all</button><button className="button button-outline" onClick={() => chooseCookies("essential")}>Essential only</button></div></aside>;
}

function TermsPage() {
  return <div className="terms-page"><header className="terms-header"><a className="brand" href="/#top"><span className="brand-orbit"><span>✦</span></span><span><strong>SuperNova</strong><small>money, made practical</small></span></a><a className="terms-back" href="/#top">Back to home <ArrowRight size={15} /></a></header><main className="terms-content"><span className="section-label">LEGAL / 01</span><h1>Terms &<br /><em>Conditions.</em></h1><p className="terms-intro">These terms explain the basic rules for using the SuperNova website and learning resources.</p><p className="terms-updated">Last updated: 27 September 2026</p><section><h2>1. About SuperNova</h2><p>SuperNova is an educational concept and learning platform focused on practical financial literacy. The website shares curriculum ideas, course information, visual learning resources and opportunities to join a pilot.</p></section><section><h2>2. Educational information only</h2><p>SuperNova content is for general education and awareness. It is not financial, investment, tax, legal or insurance advice. Do not make a financial decision solely from a lesson, example, simulator or other content on this website. Seek advice from a suitably qualified professional where appropriate.</p></section><section><h2>3. Young people and guardians</h2><p>Some learning topics are designed for young people. A parent, guardian, teacher or school should review participation in any pilot, workshop or activity and supervise real-money decisions. The site does not ask young learners to open accounts, transfer money or share financial credentials.</p></section><section><h2>4. Acceptable use</h2><p>You agree not to misuse the website, attempt to disrupt its operation, copy or resell its materials as your own, upload malicious content, or use the site to collect personal information from another person without permission.</p></section><section><h2>5. Intellectual property</h2><p>Unless otherwise stated, SuperNova branding, copy, layouts, illustrations, course structures and original materials belong to Team SuperNova or its licensors. You may view and share links for personal, educational or internal school discussion, but must not reproduce substantial portions commercially without written permission.</p></section><section><h2>6. Pilot interest and communications</h2><p>Submitting interest does not guarantee admission, enrollment or a specific course date. If you contact the team, please provide accurate information and use a contact method you control. We may reply about your request, pilot updates or workshop coordination.</p></section><section><h2>7. Privacy and cookies</h2><p>We aim to collect only what is needed for a useful experience. Cookie choices are managed through the permission banner. Please do not submit sensitive financial information, passwords, OTPs, bank details or identity documents through this website.</p></section><section><h2>8. Availability and changes</h2><p>We may update, suspend or remove parts of the website, course descriptions or pilot plans without notice. We provide the website on an “as available” basis and do not promise that every page will always be uninterrupted or error-free.</p></section><section><h2>9. Contact</h2><p>For questions about these terms, pilot participation or school workshops, use the contact method provided by Team SuperNova on the relevant invitation or communication.</p></section></main><footer className="site-footer terms-footer"><span>Team SuperNova · 2026</span><div><a href="/#top">Back to SuperNova</a><button className="footer-settings" onClick={() => window.dispatchEvent(new Event("supernova-open-cookie-settings"))}>Cookie settings</button></div></footer></div>;
}

type FormMode = "ask" | "registration";

function AudienceGate({ onChoose }: { onChoose: (role: "parent" | "student") => void }) {
  return <div className="audience-gate"><div className="audience-gate-card"><span className="section-label">WELCOME TO SUPERNOVA</span><h2>Who are you<br /><em>here for?</em></h2><p>Choose a view so we can make the experience more useful for you.</p><div className="audience-choice-grid"><button onClick={() => onChoose("parent")}><ShieldCheck size={22} /><strong>I’m a parent</strong><span>See progress, habits and section certificates.</span><ArrowRight size={16} /></button><button onClick={() => onChoose("student")}><Sparkles size={22} /><strong>I’m a student</strong><span>Explore practical money skills and courses.</span><ArrowRight size={16} /></button></div><small>Your choice is saved only in this browser and can be changed later.</small></div></div>;
}

type DashboardCourse = { courseKey: string; title: string; completedModules: number; totalModules: number; updatedAt: string | null };

function ParentPortal({ onClose, onAsk, onRegister }: { onClose: () => void; onAsk: () => void; onRegister: () => void }) {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<DashboardCourse[]>([]);
  const [dashboardError, setDashboardError] = useState("");
  const refresh = async () => {
    const accessToken = window.localStorage.getItem("supernova-parent-status-token");
    if (!accessToken) { setStatus(null); return; }
    setLoading(true); setDashboardError("");
    try {
      const statusResponse = await fetch(`/api/parent-status?token=${encodeURIComponent(accessToken)}`, { cache: "no-store" });
      const statusData = await statusResponse.json();
      if (!statusResponse.ok) throw new Error(statusData.error || "The parent request could not be found.");
      setStatus(statusData.status || "unknown");
      if (statusData.status === "approved") {
        const dashboardResponse = await fetch(`/api/parent-dashboard?token=${encodeURIComponent(accessToken)}`, { cache: "no-store" });
        const dashboardData = await dashboardResponse.json();
        if (!dashboardResponse.ok) throw new Error(dashboardData.error || "Dashboard unavailable");
        setCourses(dashboardData.courses || []);
      } else setCourses([]);
    } catch (error) { setDashboardError(error instanceof Error ? error.message : "Dashboard unavailable"); }
    finally { setLoading(false); }
  };
  useEffect(() => { void refresh(); }, []);
  const approved = status === "approved";
  const completedModules = courses.reduce((sum, course) => sum + course.completedModules, 0);
  const totalModules = courses.reduce((sum, course) => sum + course.totalModules, 0);
  return <div className="portal-overlay"><div className="parent-portal"><header className="portal-header"><div><span className="section-label">PARENT PORTAL / {approved ? "STUDENT DASHBOARD" : "CONSENT STATUS"}</span><h2>{approved ? <>See the<br /><em>learning path.</em></> : <>Support the next<br /><em>money move.</em></>}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close parent portal"><X size={20} /></button></header>{approved ? <><div className="dashboard-approved-banner"><div><span className="portal-kicker">STUDENT ACCESS APPROVED</span><h3>A clearer view of progress.</h3><p>Course progress is shown from the student record. Empty progress means no course activity has been recorded yet—not that work is missing.</p></div><BadgeCheck size={34} /></div><div className="dashboard-summary"><div><strong>{completedModules}</strong><span>modules complete</span></div><div><strong>{courses.length}</strong><span>courses tracked</span></div><div><strong>{totalModules ? Math.round((completedModules / totalModules) * 100) : 0}%</strong><span>path complete</span></div></div><section className="dashboard-courses"><div className="dashboard-section-heading"><div><span className="section-label">COURSE PROGRESS</span><h3>Progress worth noticing.</h3></div><button className="button button-outline" onClick={() => void refresh()} disabled={loading}>{loading ? "Refreshing…" : "Refresh"}</button></div><div className="dashboard-course-grid">{courses.map((course) => { const percent = course.totalModules ? Math.round((course.completedModules / course.totalModules) * 100) : 0; return <article className="dashboard-course-card" key={course.courseKey}><div className="dashboard-course-top"><span>{course.completedModules}/{course.totalModules} modules</span><b>{percent}%</b></div><h4>{course.title}</h4><div className="progress-track"><span style={{ width: `${percent}%` }} /></div><small>{course.completedModules === 0 ? "Not started yet" : percent === 100 ? "Course complete" : "In progress"}</small></article>; })}</div>{dashboardError && <p className="dashboard-error">{dashboardError}</p>}</section></> : <div className={`portal-empty ${status === "denied" || status === "expired" ? "portal-denied" : ""}`}><div className="portal-empty-icon">{status === "denied" ? <X size={28} /> : <ShieldCheck size={28} />}</div><span className="section-label">{status === "pending" ? "AWAITING STUDENT DECISION" : status === "denied" ? "ACCESS DENIED" : status === "expired" ? "REQUEST EXPIRED" : "NO STUDENT CONNECTED"}</span><h3>{status === "pending" ? "The student still needs to choose." : status === "denied" ? "The student declined this request." : status === "expired" ? "This request is no longer active." : "Your parent view starts with permission."}</h3><p>{status === "pending" ? "A secure email was sent to the student’s registered email with unique Approve and Deny links. The portal remains locked until the student responds." : status === "denied" ? "No parent progress or certificate information is available." : status === "expired" ? "Consent links expire after 48 hours. Submit a new request to start again." : "To protect student privacy, SuperNova does not show progress, certificates or activity until the student confirms permission."}</p>{status === "pending" && <button className="button button-outline" onClick={() => void refresh()} disabled={loading}>{loading ? "Checking…" : "Check approval status"}</button>}{status !== "pending" && <button className="button button-coral" onClick={onRegister}>Request parent access <ArrowRight size={16} /></button>}</div>}<div className="portal-columns"><section><span className="section-label">SECURE CONSENT</span><h3>What happens next.</h3><ul><li>The student receives a unique approval email</li><li>Each link expires after 48 hours and works once</li><li>The dashboard unlocks only after approval</li></ul></section><section><span className="section-label">NEED HELP?</span><h3>Ask the team.</h3><p className="portal-help-copy">Questions about consent, progress or the learning path can be sent directly to the SuperNova team.</p><button className="text-button" onClick={onAsk}>Ask SuperNova <ArrowRight size={15} /></button></section></div><div className="portal-actions"><button className="button button-outline" onClick={onClose}>Back to learning path</button></div></div></div>;
}

function ParentAccessModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: (message: string, parentStatusToken?: string) => void }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSending(true);
    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/access-request", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ parentEmail: formData.get("parent_email"), studentEmail: formData.get("student_email") }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to send");
      if (data.parentStatusToken) window.localStorage.setItem("supernova-parent-status-token", data.parentStatusToken);
      setSent(true); onSuccess("The secure consent request was sent to the student’s registered email.", data.parentStatusToken);
    } catch (error) { setSending(false); onSuccess(error instanceof Error ? error.message : "We couldn’t send this request right now. Please try again."); }
  };
  return <div className="modal-backdrop"><div className="contact-modal"><button className="icon-button modal-close" onClick={onClose} aria-label="Close parent access form"><X size={19} /></button>{sent ? <div className="form-success"><BadgeCheck size={35} /><span className="section-label">REQUEST RECEIVED</span><h2>Consent comes<br /><em>before access.</em></h2><p>The request was sent to Samarth’s email and copied to the student’s registered email. The parent view stays locked until the student confirms permission.</p><button className="button button-ink" onClick={onClose}>Back to portal</button></div> : <><span className="section-label">PARENT ACCESS REQUEST</span><h2>Connect with<br /><em>permission.</em></h2><p className="modal-lede">Enter both email addresses. The student receives a copy and must independently confirm before any parent view is connected.</p><form onSubmit={submit} className="contact-form"><label>Parent email<input name="parent_email" type="email" required placeholder="parent@example.com" /></label><label>Student’s registered email<input name="student_email" type="email" required placeholder="student@example.com" /></label><p className="form-consent-note"><ShieldCheck size={15} /> The student—not the parent—must approve or deny this request from their registered email.</p><button className="button button-coral" disabled={sending}>{sending ? "Sending…" : "Request consent review"} <ArrowRight size={16} /></button><small>Student privacy is protected. The request goes to <strong>samarthkalani0@gmail.com</strong> and a copy goes to the student email.</small></form></>}</div></div>;
}

function EmailFormModal({ mode, onClose, onSuccess }: { mode: FormMode; onClose: () => void; onSuccess: (message: string) => void }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const isAsk = mode === "ask";
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true);
    const form = event.currentTarget;
    const data = new FormData(form);
    data.append("_subject", isAsk ? "New Ask SuperNova response" : "New SuperNova registration response");
    data.append("_template", "table");
    data.append("_captcha", "false");
    try {
      const response = await fetch("https://formsubmit.co/ajax/samarthkalani0@gmail.com", { method: "POST", headers: { Accept: "application/json" }, body: data });
      if (!response.ok) throw new Error("Unable to send");
      setSent(true);
      onSuccess(isAsk ? "Your question was sent to Samarth’s email." : "Your registration response was sent to Samarth’s email.");
    } catch {
      setSending(false);
      onSuccess("We couldn’t send this right now. Please try again or email samarthkalani0@gmail.com directly.");
    }
  };
  return <div className="modal-backdrop"><div className="contact-modal"><button className="icon-button modal-close" onClick={onClose} aria-label="Close form"><X size={19} /></button>{sent ? <div className="form-success"><BadgeCheck size={35} /><span className="section-label">MESSAGE RECEIVED</span><h2>Thanks —<br /><em>you’re on the list.</em></h2><p>Samarth’s team will receive your response at <strong>samarthkalani0@gmail.com</strong>.</p><button className="button button-ink" onClick={onClose}>Back to SuperNova</button></div> : <><span className="section-label">{isAsk ? "ASK SUPERNOVA" : "JOIN THE PILOT"}</span><h2>{isAsk ? <>What’s on<br /><em>your mind?</em></> : <>Register your<br /><em>interest.</em></>}</h2><p className="modal-lede">{isAsk ? "Send your question directly to the SuperNova team." : "Share your details and the team will follow up about the right course, parent view or school pilot."}</p><form onSubmit={submit} className="contact-form"><label>Name<input name="name" required placeholder="Your name" /></label><label>Email<input name="email" type="email" required placeholder="you@example.com" /></label><label>{isAsk ? "Your question" : "What are you interested in?"}<textarea name="message" required rows={4} placeholder={isAsk ? "Ask about a course, certificate or workshop..." : "Student course, parent portal, school workshop..."} /></label><label className="form-check"><input name="role" type="checkbox" value="Parent" /> I’m a parent / guardian</label><button className="button button-coral" disabled={sending}>{sending ? "Sending…" : isAsk ? "Send to SuperNova" : "Send registration"} <ArrowRight size={16} /></button><small>Responses go to <strong>samarthkalani0@gmail.com</strong>.</small></form></>}</div></div>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCourse, setActiveCourse] = useState(1);
  const [activeCertificate, setActiveCertificate] = useState(0);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [toast, setToast] = useState("");
  const [audience, setAudience] = useState<"parent" | "student" | null>(null);
  const [portalOpen, setPortalOpen] = useState(false);
  const [parentAccessOpen, setParentAccessOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const parentStatusToken = params.get("parent-status");
    if (parentStatusToken) {
      window.localStorage.setItem("supernova-parent-status-token", parentStatusToken);
      window.localStorage.setItem("supernova-audience", "parent");
      setAudience("parent");
      setPortalOpen(true);
    }
    if (params.get("reset") === "parent") {
      window.localStorage.removeItem("supernova-parent-status-token");
      window.localStorage.removeItem("supernova-parent-status-token-v2");
    }
    if (params.get("choose") === "1" || params.get("reset") === "audience") {
      window.localStorage.removeItem("supernova-audience");
    }
    const savedAudience = window.localStorage.getItem("supernova-audience");
    if (savedAudience === "parent" || savedAudience === "student") setAudience(savedAudience);
  }, []);

  if (new URLSearchParams(window.location.search).get("page") === "terms") {
    return <><TermsPage /><CookieBanner /></>;
  }

  if (!audience) {
    return <AudienceGate onChoose={(role) => { window.localStorage.setItem("supernova-audience", role); setAudience(role); setPortalOpen(role === "parent"); }} />;
  }

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3400);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const openAsk = () => setFormMode("ask");
  const openRegistration = () => setFormMode("registration");

  return (
    <div className="site-shell">
      {toast && <div className="toast"><Check size={16} /> {toast}</div>}
      <header className="site-header">
        <a className="brand" href="#top" aria-label="SuperNova home"><span className="brand-orbit"><span>✦</span></span><span><strong>SuperNova</strong><small>money, made practical</small></span></a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <button onClick={() => scrollTo("why")}>Why it matters</button>
          <button onClick={() => scrollTo("platform")}>The platform</button>
          <button onClick={() => scrollTo("certificates")}>Merit system</button>
          <button onClick={() => scrollTo("courses")}>Courses</button>
        </nav>
        <div className="header-actions"><button className="nav-link" onClick={() => setPortalOpen(true)}>Parent portal <ArrowRight size={15} /></button><button className="nav-link" onClick={openRegistration}>Join the pilot <ArrowRight size={15} /></button><button className="mobile-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button></div>
        {menuOpen && <div className="mobile-nav"><button onClick={() => scrollTo("why")}>Why it matters</button><button onClick={() => scrollTo("platform")}>The platform</button><button onClick={() => scrollTo("certificates")}>Merit system</button><button onClick={() => scrollTo("courses")}>Courses</button><button onClick={() => { setMenuOpen(false); setPortalOpen(true); }}>Parent portal</button><button className="mobile-cta" onClick={() => { setMenuOpen(false); openRegistration(); }}>Join the pilot <ArrowRight size={15} /></button></div>}
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-grid-lines" aria-hidden="true" />
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> Financial literacy for the next generation</div>
            <h1>Money skills should feel <em>useful.</em></h1>
            <p className="hero-lede">SuperNova helps teens move from “I should probably know this” to making confident, informed money decisions — one small practice at a time.</p>
            <div className="hero-buttons"><button className="button button-coral" onClick={() => scrollTo("courses")}>Explore the learning path <ArrowRight size={16} /></button><button className="text-button" onClick={() => scrollTo("why")}>See the evidence <ArrowDown size={16} /></button></div>
          </div>
          <div className="hero-visual">
            <div className="orbit orbit-one" /><div className="orbit orbit-two" />
            <div className="phone-card">
              <div className="phone-top"><span>SuperNova / 01</span><span className="live-dot">● LIVE</span></div>
              <div className="phone-title">This week’s<br /><em>money move</em></div>
              <div className="phone-prompt">You get ₹500. How will you make it last?</div>
              <div className="money-options"><div><span className="option-icon">◎</span><span>Save first</span><strong>₹250</strong></div><div><span className="option-icon">↗</span><span>Spend mindfully</span><strong>₹180</strong></div><div><span className="option-icon">+</span><span>Keep a buffer</span><strong>₹70</strong></div></div>
              <button className="phone-action" onClick={() => showToast("Nice choice. Reflection added to your learning streak.")}>Make the move <ArrowRight size={14} /></button>
              <div className="phone-footer"><span>STREAK</span><strong>06 days</strong><span className="streak-bars"><i /><i /><i /><i /><i /><i /></span></div>
            </div>
            <div className="floating-sticker"><Sparkles size={13} /><span>learn by doing</span></div>
            <div className="hero-caption"><span>01</span><p>Small decisions<br />add up.</p></div>
          </div>
        </section>

        <section id="why" className="evidence-section section-dark">
          <div className="section-inner">
            <div className="section-heading heading-split"><div><span className="section-label">01 / THE WHY</span><h2>The money gap is real.<br /><em>The appetite is realer.</em></h2></div><p>We spoke to 83 pre-teens and teens, ages 11–19, to understand where financial education breaks down — and whether young people actually want a better way.</p></div>
            <div className="stats-grid">{problemStats.map((stat) => <article className="stat-card" key={stat.value}><strong>{stat.value}</strong><span>{stat.label}</span><small>{stat.detail}</small></article>)}</div>
          </div>
        </section>

        <section id="platform" className="platform-section section-light">
          <div className="section-inner"><div className="section-heading heading-split"><div><span className="section-label">02 / THE PLATFORM</span><h2>Not a lecture.<br /><em>A practice ground.</em></h2></div><p>SuperNova combines verified curriculum, low-pressure practice and near-peer support into a system that makes progress visible — to teens, parents and schools.</p></div>
            <div className="solution-grid">{solutionBlocks.map((block) => { const Icon = block.icon; return <article className="solution-card interactive-card" key={block.number} tabIndex={0} role="button" onClick={() => showToast(`${block.title}: added to your SuperNova learning plan.`)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") showToast(`${block.title}: added to your SuperNova learning plan.`); }}><div className="solution-top"><span>{block.number}</span><Icon size={21} /></div><h3>{block.title}</h3><p>{block.text}</p></article>; })}</div>
          </div>
        </section>

        <section id="certificates" className="merit-section">
          <div className="section-inner"><div className="section-heading heading-split merit-heading"><div><span className="section-label">03 / MERIT SYSTEM</span><h2>Complete it.<br /><em>Carry it with you.</em></h2></div><p>Every finished section earns its own certificate. Learners build a clear portfolio of practical money skills instead of moving through a single rank ladder.</p></div>
            <div className="certificate-layout"><div className="certificate-visual"><div className="certificate-ring"><span>✦</span><small>SECTION<br />AWARDS</small></div><div className="certificate-copy"><span>SECTION CERTIFICATION</span><strong>Practical money<br /><em>skills, recognised.</em></strong><small>One certificate for every completed section.<br />Designed for learners and school-led recognition.</small><div className="certificate-selected">Selected: <b>{sectionCertificates[activeCertificate].section}</b></div></div><div className="certificate-seal"><BadgeCheck size={20} /><span>verified<br />completion</span></div></div><div className="levels-list">{sectionCertificates.map((certificate, index) => <button className={`level-row ${certificate.color} ${activeCertificate === index ? "active" : ""}`} key={certificate.section} onClick={() => setActiveCertificate(index)} aria-pressed={activeCertificate === index}><span className="level-number">{certificate.score}</span><div className="level-badge"><span><BadgeCheck size={20} /></span></div><div className="level-copy"><div><span>{certificate.caption}</span><h3>{certificate.section}</h3></div><p>{certificate.detail}</p></div><ArrowRight size={18} /></button>)}</div></div>
          </div>
        </section>

        <section id="courses" className="courses-section section-light">
          <div className="section-inner"><div className="section-heading heading-split"><div><span className="section-label">04 / THE COURSES</span><h2>A learning path<br /><em>with a next step.</em></h2></div><p>Start with what feels close to home. Build habits in small moves. Then use the system to make better decisions in the real world.</p></div>
            <div className="course-tabs">{courses.map((course, index) => <button className={activeCourse === index ? "active" : ""} onClick={() => setActiveCourse(index)} key={course.title}><span>{String(index + 1).padStart(2, "0")}</span>{course.title}</button>)}</div>
            <div className={`course-feature ${courses[activeCourse].accent}`}><div className="course-number">{String(activeCourse + 1).padStart(2, "0")}</div><div className="course-feature-main"><span className="section-label">{courses[activeCourse].level}</span><h3>{courses[activeCourse].title}</h3><p>{courses[activeCourse].description}</p><button className="button button-ink" onClick={openRegistration}>I’m interested <ArrowRight size={16} /></button></div><div className="course-lessons"><span>{courses[activeCourse].age}</span><strong>Inside this course</strong>{courses[activeCourse].lessons.map((lesson) => <div key={lesson}><Check size={15} /> {lesson}</div>)}<small>+ practical reflection</small></div></div>
            <div className="video-library-heading"><div><span className="section-label">VIDEO LIBRARY</span><h3>Choose a topic.<br /><em>Press play on real life.</em></h3></div><p>Every module turns a money question into a visual, practical lesson designed for the decisions teens are already making.</p></div>
            <div className="track-list">{topicTracks.map((track, index) => <section className="track-section" key={track}><div className="track-heading"><span className="section-label">COURSE TRACK 0{index + 1}</span><h4>{track}</h4><span>{topicVideos.filter((topic) => topic.track === track).length} modules</span></div><div className="video-grid">{topicVideos.filter((topic) => topic.track === track).map((topic) => <article className="video-card" key={topic.number}><div className="video-image-wrap"><img src={topic.image} alt={`${topic.title} video thumbnail`} /><span className={`video-index ${topic.color}`}>{topic.number}</span><span className="video-play"><Play size={15} fill="currentColor" /></span></div><div className="video-card-copy"><span>MODULE {topic.number}</span><h4>{topic.title}</h4><p>{topic.subtitle}</p></div></article>)}</div></section>)}</div>
          </div>
        </section>

        <section className="audience-section section-dark"><div className="section-inner"><span className="section-label">05 / BUILT AROUND REAL PEOPLE</span><div className="audience-grid"><div><h2>One system.<br /><em>Three perspectives.</em></h2><p>Because a teen’s money journey doesn’t happen alone.</p></div><div className="audience-cards"><article className="interactive-audience" tabIndex={0} role="button" onClick={() => showToast("Teen learner view selected.")}><span className="audience-icon"><Users size={19} /></span><span className="section-label">FOR TEENS</span><h3>Make the decision.</h3><p>Build confidence through practice, feedback and rewards that feel earned.</p></article><article className="interactive-audience" tabIndex={0} role="button" onClick={() => setPortalOpen(true)}><span className="audience-icon"><ShieldCheck size={19} /></span><span className="section-label">FOR PARENTS</span><h3>See the progress.</h3><p>Get a light companion view of habits and results without taking over.</p></article><article className="interactive-audience" tabIndex={0} role="button" onClick={() => showToast("School integration view selected.")}><span className="audience-icon"><GraduationCap size={19} /></span><span className="section-label">FOR SCHOOLS</span><h3>Make it count.</h3><p>Bring a structured, recognisable financial education layer into the timetable.</p></article></div></div></div></section>

        <section className="faq-section section-light"><div className="section-inner faq-layout"><div><span className="section-label">06 / QUESTIONS</span><h2>Good questions<br /><em>are a good start.</em></h2><button className="button button-coral" onClick={openAsk}>Ask SuperNova <MessageCircle size={16} /></button></div><div className="faq-list">{["Is SuperNova a course or a platform?", "How do the certificates work?", "Can schools run a workshop with SuperNova?", "What ages is it built for?"].map((question, index) => <div className={`faq-item ${faqOpen === index ? "open" : ""}`} key={question}><button onClick={() => setFaqOpen(faqOpen === index ? null : index)}><span>0{index + 1}</span><strong>{question}</strong><ChevronDown size={18} /></button>{faqOpen === index && <p>{index === 0 ? "Both. SuperNova is the learning system; courses are the structured paths inside it, supported by practice, progress and mentorship." : index === 1 ? "Each completed section earns its own certificate after the learner finishes the lessons and practical activity. Together, the certificates create a useful portfolio of money skills." : index === 2 ? "Yes. The concept includes school integration and workshop delivery, with a curriculum that can sit alongside existing learning." : "The current concept is designed for pre-teens and teens, with courses adjusted by age and readiness."}</p>}</div>)}</div></div></section>

        <section className="final-cta"><div className="final-cta-orbit" /><div className="section-inner"><span className="section-label">THE NEXT MONEY MOVE</span><h2>Let’s make financial confidence<br /><em>feel possible.</em></h2><p>Join the pilot conversation, bring SuperNova into your school, or help us shape the first course cohort.</p><div className="hero-buttons"><button className="button button-ink" onClick={openRegistration}>Start the conversation <ArrowRight size={16} /></button><button className="text-button text-button-light" onClick={openRegistration}>Bring it to a school <ArrowRight size={16} /></button></div></div></section>
      </main>
      <footer className="site-footer"><a className="brand brand-footer" href="#top"><span className="brand-orbit"><span>✦</span></span><span><strong>SuperNova</strong><small>money, made practical</small></span></a><span>Team SuperNova · 2026</span><div><a href="#courses">Courses</a><a href="#certificates">Certificates</a><a href="#why">Our evidence</a><a href="/?choose=1">Change view</a><a href="/?page=terms">Terms & conditions</a><button className="footer-settings" onClick={() => window.dispatchEvent(new Event("supernova-open-cookie-settings"))}>Cookie settings</button></div></footer>
      <CookieBanner />
      {portalOpen && <ParentPortal onClose={() => setPortalOpen(false)} onAsk={() => { setPortalOpen(false); setFormMode("ask"); }} onRegister={() => { setPortalOpen(false); setParentAccessOpen(true); }} />}
      {parentAccessOpen && <ParentAccessModal onClose={() => setParentAccessOpen(false)} onSuccess={(message, token) => { if (token) window.localStorage.setItem("supernova-parent-status-token", token); setParentAccessOpen(false); showToast(message); }} />}
      {formMode && <EmailFormModal mode={formMode} onClose={() => setFormMode(null)} onSuccess={(message) => { setFormMode(null); showToast(message); }} />}
    </div>
  );
}

export default App;
