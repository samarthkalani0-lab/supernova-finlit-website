# SuperNova full-stack consent workflow

## What is implemented

- Persistent SQLite database at `data/supernova.sqlite` locally, or the configured `DB_PATH` in production.
- Parent access requests stored with parent email, student email, status, timestamps, and decision metadata.
- Cryptographically random 32-byte approval and denial tokens.
- Only SHA-256 token hashes are stored in the database.
- Approval and denial links expire after 48 hours.
- A request can transition from `pending` only once.
- Student receives unique **Approve access** and **Deny access** links by email.
- Parent receives a status token and can check whether the request is pending, approved, denied, or expired.
- Parent portal stays locked unless status is `approved`.
- Approved parents receive a dashboard with four tracked course paths and module progress from `student_course_progress`.
- New progress records start at zero and are explicitly shown as “Not started yet”; no completion data is invented.
- Decision notifications are sent to the owner and copied to the parent.
- `GET /api/health` is available for Render health checks.

## Run locally

```bash
cp .env.example .env
pnpm install
pnpm build
pnpm start
```

The server listens on `PORT` (default `4173`) and serves both the built site and `/api/*` endpoints.

## Deploy to Render

The repository includes `render.yaml` for a one-instance Render Web Service. It configures:

- Build command: `pnpm install --frozen-lockfile && pnpm build`
- Start command: `pnpm start`
- Health check: `/api/health`
- Persistent disk mounted at `/var/data`
- SQLite path: `/var/data/supernova.sqlite`

For a production parent portal, deploy the Blueprint or configure the same values manually in Render. A persistent disk is required because Render's normal filesystem is ephemeral. Keep the service at one instance while using SQLite.

Required production environment variables:

- `OWNER_EMAIL` — notification destination, currently `samarthkalani0@gmail.com`
- `PUBLIC_BASE_URL` — actual HTTPS origin used in approval/denial links
- `DB_PATH` — set to `/var/data/supernova.sqlite` when using the Render disk
- `PORT` — supplied automatically by Render

After the first real submission, activate `OWNER_EMAIL` through FormSubmit's first-use confirmation email. Do not set `DISABLE_EMAILS=1` in production.

## Email delivery

The current implementation uses FormSubmit as the outbound email relay. Before testing real requests, activate `OWNER_EMAIL` through FormSubmit’s first-use confirmation email. Set `PUBLIC_BASE_URL` to the actual HTTPS site origin so links in student emails point to the deployed app.

For local state-machine tests only, set `DISABLE_EMAILS=1`.

## Consent flow

1. Parent submits both email addresses.
2. The server stores a pending request and returns a parent status token.
3. The server emails the student unique one-time links.
4. Student clicks Approve or Deny.
5. The server atomically records the first decision and invalidates the other path.
6. Parent status changes accordingly.

## Parent dashboard

`GET /api/parent-dashboard?token=...` returns data only when the parent status token belongs to an approved request. Pending, denied, expired, invalid, or missing tokens receive no dashboard data. The current public build seeds four course-progress rows per request; a future student account/progress editor can update those rows without changing the parent authorization boundary.

The parent status token is stored only in the parent browser’s local storage. For a multi-device parent account, add authenticated accounts and server-side sessions before exposing detailed student records.
