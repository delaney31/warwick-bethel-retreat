# Warwick Bethel Retreat — Production deployment

Deploy **Warwick Bethel Retreat** on the **same stack** as Pacific Luxe Direct:

| Provider | Pacific Luxe (existing) | Warwick Bethel Retreat (new) |
|----------|-------------------------|------------------------------|
| **GitHub** | `pacific-luxe-direct` (vehicles) | **`WarwickBethelRetreat`** (this repo) |
| **Vercel** | Project `pacific-luxe-direct` → `frontend/` | **New** project → repo root `.` |
| **Render** | Web service → `api/PacificLuxe.Api` (vehicles) | **New** web service → same Dockerfile, **retreat env** |
| **Neon** | Postgres DB (vehicles data) | **New** Postgres DB (retreat data only) |

```
GitHub (`WarwickBethelRetreat` — this repo)
    │
    ├──► Vercel: pacific-luxe-direct     (frontend/)           → Pacific Luxe site
                         ├──► Vercel: warwick-bethel-retreat  (repo root) → Retreat site
    │
    ├──► Render: pacific-luxe-api        (ProductLine=Vehicle)  → vehicle DB
    └──► Render: warwick-retreat-api     (ProductLine=Retreat)   → retreat DB
              │                                    │
              ▼                                    ▼
         Neon: pacific_luxe                   Neon: warwick_bethel_retreat
```

**Important:** Use a **separate Neon database** (or dedicated Neon project) for the retreat. Do not point both APIs at the same `ConnectionStrings__DefaultConnection` unless you intend to share one schema and mixed data.

---

## Prerequisites (reuse Pacific Luxe accounts)

You already need (same as Pacific Luxe):

- [ ] **GitHub** — repo access to `PacificLuxeRentals`
- [ ] **Vercel** — team/account that hosts `pacific-luxe-direct`
- [ ] **Render** — account with Pacific Luxe API service
- [ ] **Neon** — account with Pacific Luxe Postgres

No new vendor signup required — only **new resources** inside each provider.

---

## Phase 1 — Neon (retreat database)

### 1.1 Create a second database

In the **same Neon account** as Pacific Luxe (recommended: **new project** or **new database** for clarity):

1. Open [Neon Console](https://console.neon.tech).
2. **Option A (cleanest):** Create project **`warwick-bethel-retreat`** → create database `warwick_bethel_retreat`.
3. **Option B:** In the existing Pacific Luxe project, add a **second database** (if your plan supports it).

### 1.2 Copy connection string

1. Neon → your retreat database → **Connection details**.
2. Use the **pooled** connection string (host contains `-pooler`).
3. Ensure **`SSL Mode=Require`** (Neon usually includes this).
4. Save as a secret — you will paste it only into **Render** (never commit to git).

Example shape (values will differ):

```text
Host=ep-xxxx-pooler.us-west-2.aws.neon.tech;Database=warwick_bethel_retreat;Username=...;Password=...;SSL Mode=Require
```

Or Neon’s `postgresql://...` URL — Render accepts Npgsql-style strings; the API also maps `DATABASE_URL` if you set it.

### 1.3 Verify branch

Use the **`production`** branch connection string for production Render (same lesson as Pacific Luxe: SQL editor branch must match Render’s URL).

---

## Phase 2 — Render (retreat API)

### 2.1 Create a new Web Service

1. [Render Dashboard](https://dashboard.render.com) → **New +** → **Web Service**.
2. Connect the **same GitHub repo** `PacificLuxeRentals`.
3. Settings:

| Field | Value |
|-------|--------|
| **Name** | `warwick-retreat-api` (or your choice) |
| **Region** | Same as Pacific Luxe API (e.g. Oregon / US West) |
| **Branch** | `main` (or your production branch) |
| **Root Directory** | `api/PacificLuxe.Api` |
| **Runtime** | **Docker** |
| **Dockerfile Path** | `Dockerfile` |
| **Health Check Path** | `/health` |

### 2.2 Environment variables

Copy the **pattern** from your existing Pacific Luxe Render service, then set **retreat-specific** values:

| Key | Value | Notes |
|-----|--------|--------|
| `ConnectionStrings__DefaultConnection` | Neon retreat URL from Phase 1 | **Different DB** than Pacific Luxe |
| `ProductLine__Value` | `Retreat` | Enables retreat seed + pricing + approval flow |
| `SeedFleet` | `false` | Do not load Porsche fleet |
| `SeedRetreat` | `true` | Seed `warwick-bethel-retreat` property |
| `Jwt__SigningKey` | New random string ≥ 32 chars | Can match Pacific Luxe or use a new one |
| `Jwt__Issuer` | Same as Pacific Luxe if you want | Optional |
| `Jwt__Audience` | Same as Pacific Luxe if you want | Optional |
| `AdminSeed__Email` | `admin@warwickbethelretreat.com` | First admin when table empty |
| `AdminSeed__Password` | Strong password | Same process as Pacific Luxe admin seed |
| `FRONTEND_URL` | *(set after Vercel — Phase 3)* | e.g. `https://warwick-bethel-retreat.vercel.app` |
| `ASPNETCORE_ENVIRONMENT` | `Production` | Default for Render |

**Stripe / email (when ready)** — copy from Pacific Luxe Render if you use the same keys:

| Key | Reuse from Pacific Luxe? |
|-----|---------------------------|
| `Stripe__SecretKey` | Optional — same Stripe account, different webhook endpoint per service |
| `Stripe__WebhookSecret` | **New** webhook URL for this Render service |
| `Resend__ApiKey` / `Email__*` | Optional — same Resend account |

### 2.3 Deploy and verify

1. **Create Web Service** → wait for first deploy (5–15 min).
2. Logs should show: `Database schema is up to date` and `Retreat property seed complete`.
3. Note **URL**: `https://warwick-retreat-api.onrender.com` (your hostname).
4. Smoke test:

```bash
curl -s -o /dev/null -w "%{http_code}" https://<your-retreat-api>.onrender.com/health
# Expect: 200
```

5. Optional: `GET https://<api>/api/vehicles/warwick-bethel-retreat` → property JSON.

### 2.4 CORS (after Vercel URL is known)

Set on this Render service:

```text
FRONTEND_URL=https://<your-vercel-production-domain>
```

For Vercel **preview** deploys, add:

```text
Cors__Origins__1=https://warwick-bethel-retreat-git-main-<team>.vercel.app
```

Redeploy Render after changing env vars.

---

## Phase 3 — Vercel (retreat frontend)

### 3.1 Create a new Vercel project (same GitHub repo)

1. [Vercel Dashboard](https://vercel.com) → **Add New…** → **Project**.
2. Import **`PacificLuxeRentals`** (same repo as Pacific Luxe).
3. **Configure Project:**

| Field | Value |
|-------|--------|
| **Project Name** | `warwick-bethel-retreat` |
| **Root Directory** | `warwick-bethel-retreat` |
| **Framework Preset** | Next.js |
| **Build Command** | `npm run build` (default) |
| **Output Directory** | `.next` (default) |

### 3.2 Environment variables

Mirror Pacific Luxe Vercel setup (`frontend` → env vars), with retreat URLs:

| Variable | Production value | Notes |
|----------|------------------|--------|
| `NEXT_PUBLIC_API_BASE_URL` | `https://<your-retreat-api>.onrender.com` | **No** trailing `/api` |
| `INTERNAL_API_URL` | Same as above | Server-side / SSR fallback |
| `NEXT_PUBLIC_APP_URL` | `https://warwick-bethel-retreat.vercel.app` | Or custom domain |
| `NEXT_PUBLIC_APP_NAME` | `Warwick Bethel Retreat` | |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Same `pk_` as Pacific Luxe if shared Stripe | Optional until payments live |

Apply to **Production**. Copy to **Preview** if you test PRs against the retreat API.

### 3.3 Deploy

1. Click **Deploy**.
2. When finished, open the production URL.
3. Test:
   - `/` — homepage loads
   - `/book` — form loads; submit test (API must be up)
   - `/admin/login` — login with `AdminSeed` credentials

### 3.4 Link Render CORS

Return to Render → set `FRONTEND_URL` to your **exact** Vercel production origin → **Redeploy** API.

---

## Phase 4 — GitHub (automation)

Same repo, **two Vercel projects** and **two Render services** — each watches the same branch by default.

| Push to `main` triggers |
|-------------------------|
| Vercel build: `frontend/` (Pacific Luxe project) |
| Vercel build: `warwick-bethel-retreat/` (Retreat project) |
| Render deploy: Pacific Luxe API service |
| Render deploy: Warwick Retreat API service |

**Tip:** Use Render **auto-deploy** only on `main`; disable for retreat API during initial setup if you want manual first deploy.

### Branch strategy (optional)

| Branch | Use |
|--------|-----|
| `main` | Production for both products |
| `develop` | Preview on Vercel + staging Render (optional second Neon branch) |

---

## Phase 5 — Credentials alignment checklist

Use this table so retreat matches Pacific Luxe **process** without sharing **data**:

| Secret | Pacific Luxe | Warwick Retreat |
|--------|--------------|-----------------|
| Neon connection | Vehicle DB URL | **New** retreat DB URL |
| Render service | `pacific-luxe-direct` (example) | **New** `warwick-retreat-api` |
| `ProductLine__Value` | *(unset = Vehicle)* | `Retreat` |
| Vercel project | `pacific-luxe-direct` | `warwick-bethel-retreat` |
| Vercel root | `frontend` | `warwick-bethel-retreat` |
| `NEXT_PUBLIC_API_BASE_URL` | Pacific Render URL | Retreat Render URL |
| `FRONTEND_URL` on API | Pacific Vercel URL | Retreat Vercel URL |
| Admin login | Pacific `AdminSeed` | Retreat `AdminSeed` (can be same email/password if you choose) |
| GitHub repo | `PacificLuxeRentals` | **Same** |

---

## Phase 6 — Post-deploy verification

Run in order:

1. **API health:** `GET https://<retreat-api>/health` → `200`
2. **Property:** `GET https://<retreat-api>/api/vehicles/warwick-bethel-retreat` → `200`
3. **Site:** `https://<vercel-app>/` loads images and nav
4. **Calendar:** `/availability` shows calendar (calls API)
5. **Booking:** `/book` → submit test reservation → `201` / success message
6. **Neon:** SQL editor on **retreat** DB → row in `reservations`, `vehicles` has one slug
7. **Admin:** `/admin/login` → dashboard lists reservation
8. **Approve flow:** Reservation → **Awaiting Payment** → create/mark payment in admin (per Pacific Luxe payment flow)

---

## Phase 7 — Custom domain (optional)

### Vercel

1. Vercel project → **Settings** → **Domains**.
2. Add e.g. `warwickbethelretreat.com` → follow DNS instructions.

Update:

- `NEXT_PUBLIC_APP_URL` on Vercel
- `FRONTEND_URL` on Render (exact origin, `https://warwickbethelretreat.com`)

### Render

Optional custom domain on API (e.g. `api.warwickbethelretreat.com`) → update `NEXT_PUBLIC_API_BASE_URL` on Vercel.

---

## Ongoing updates (same as Pacific Luxe)

| Change location | What redeploys |
|-----------------|----------------|
| `warwick-bethel-retreat/**` | Vercel (retreat project only) |
| `api/PacificLuxe.Api/**` | **Both** Render services (shared code) |
| New EF migration in `api/` | **Both** APIs run `Migrate()` — ensure retreat DB is empty/compatible or test migrations on retreat DB first |

When you change **only** retreat frontend env vars on Vercel → **Redeploy** (required for `NEXT_PUBLIC_*`).

When you change Render env vars → **Redeploy** or restart service.

---

## Local env pull (optional, same as Pacific Luxe)

From `warwick-bethel-retreat/` after linking Vercel project:

```bash
cd warwick-bethel-retreat
npx vercel login
npx vercel link          # select warwick-bethel-retreat project
npx vercel env pull .env.vercel.local --yes
```

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Book form stuck “Connecting to API…” | Retreat Render down; wrong `NEXT_PUBLIC_API_BASE_URL`; CORS |
| Admin login fails | `FRONTEND_URL` mismatch; wrong API URL; admin not seeded (check Render logs) |
| Pacific Luxe shows retreat data (or vice versa) | Two APIs sharing one Neon DB — split databases |
| Migration error on deploy | Fresh Neon DB or fix `__EFMigrationsHistory`; see [`api/DEPLOY.md`](../api/DEPLOY.md) |
| Porsche cars appear on retreat site | `ProductLine__Value` not `Retreat` or `SeedFleet` still `true` |
| `vercel link` → `invalid json` / `Unexpected token '<'` on openid-configuration | Corporate VPN/proxy/firewall returning HTML instead of Vercel API JSON — see **Vercel CLI issues** below |

### Vercel CLI issues (`vercel link` / `invalid json`)

This error usually means something between your Mac and Vercel is intercepting HTTPS (VPN, Zscaler, corporate proxy, captive portal):

```text
FetchError: invalid json response body at https://vercel.com/.well-known/openid-configuration
Unexpected token '<', "<html>...
```

**You do not need `vercel link` to deploy.** Use the dashboard path instead.

#### Option A — Deploy without CLI (recommended)

1. [vercel.com/new](https://vercel.com/new) → import **PacificLuxeRentals** from GitHub.
2. **Root Directory:** `warwick-bethel-retreat` → Deploy.
3. **Settings → Environment Variables** — add production vars (see Phase 3.2).
4. **Redeploy** after saving env vars.

No `vercel link` or `env pull` required.

#### Option B — Fix CLI network, then link

1. Disconnect **VPN** / try another network (phone hotspot).
2. `npm run vercel:login` again (browser auth).
3. `npm run vercel:link` from `warwick-bethel-retreat/`.

#### Option C — Manual link (if login works but link fails)

1. Vercel → project **warwick-bethel-retreat** → **Settings → General** → copy **Project ID**.
2. Team/Account settings → copy **Team ID** (or user ID for hobby).
3. Create locally:

```bash
mkdir -p .vercel
```

`.vercel/project.json`:

```json
{
  "projectId": "prj_xxxxxxxx",
  "orgId": "team_xxxxxxxx"
}
```

4. Then: `npm run vercel:env:production`

#### Option D — Token auth (bypasses browser OIDC)

1. Vercel → **Account Settings → Tokens** → create token.
2. `export VERCEL_TOKEN=your_token`
3. `npx vercel link --token $VERCEL_TOKEN`

---

## Quick reference URLs (fill in after deploy)

| Resource | URL |
|----------|-----|
| Retreat website (Vercel) | `https://________________.vercel.app` |
| Retreat API (Render) | `https://________________.onrender.com` |
| Neon retreat DB | *(dashboard only)* |
| GitHub repo | `https://github.com/<org>/PacificLuxeRentals` |
| Pacific Luxe (existing) | See root [`DEPLOYMENT.md`](../DEPLOYMENT.md) |

---

## Stripe Checkout & webhooks (Vercel)

Guest payments use **Stripe Checkout** only — card data never touches this app.

### Environment variables (Vercel production)

| Variable | Purpose |
|----------|---------|
| `STRIPE_SECRET_KEY` | Server: create Checkout Sessions |
| `STRIPE_WEBHOOK_SECRET` | Verify `POST /api/stripe/webhook` signatures |
| `NEXT_PUBLIC_APP_URL` | Success/cancel redirect URLs (e.g. `https://warwick-bethel-retreat.vercel.app`) |

### Webhook endpoint

1. [Stripe Dashboard](https://dashboard.stripe.com/webhooks) → **Add endpoint**
2. URL: `https://<your-vercel-domain>/api/stripe/webhook`
3. Events: **`checkout.session.completed`**
4. Copy **Signing secret** → Vercel env `STRIPE_WEBHOOK_SECRET` (`whsec_...`)
5. Redeploy Vercel after setting secrets

Local testing:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
# Use the printed whsec_... as STRIPE_WEBHOOK_SECRET in .env.local
```

### Payment flow

1. Guest submits booking → `PENDING_REVIEW` in Postgres  
2. Host **Approve & send payment** in `/admin` → `APPROVED_AWAITING_PAYMENT` + Checkout Session  
3. Guest pays via Stripe (link: `/reservations/{id}/payment`)  
4. Webhook marks reservation **`PAID_CONFIRMED`** (amount must match DB total)  
5. Public calendar blocks those dates

### Apple Pay & wallet methods

Stripe Checkout can show **Apple Pay** when the customer's device and browser support it. For production, register your domain in Stripe:

1. Stripe Dashboard → **Settings → Payment methods → Apple Pay** (or **Payment method domains**)
2. Add your production hostname (e.g. `warwick-bethel-retreat.vercel.app` and any custom domain)
3. Complete Stripe's domain verification (hosted file or DNS as instructed)

See Stripe's guide: [Apple Pay on the Web](https://docs.stripe.com/apple-pay?platform=web).

Wallet availability also depends on HTTPS, Safari/Chrome support, and the customer having Apple Pay set up — no extra code is required beyond Checkout.

---

## Related docs

- [`README.md`](README.md) — local dev (API profile `retreat`, port 5002)
- [`../DEPLOYMENT.md`](../DEPLOYMENT.md) — Pacific Luxe Vercel + Render + Neon
- [`../api/DEPLOY.md`](../api/DEPLOY.md) — Render Docker, migrations, health check
