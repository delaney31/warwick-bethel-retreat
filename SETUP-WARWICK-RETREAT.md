# Warwick Bethel Retreat — do this now (≈20 min)

Same **GitHub repo**, **Vercel**, **Render**, **Neon** accounts as Pacific Luxe.  
Automated files added: `render.yaml`, GitHub Action, bootstrap script.

> **Vercel CLI broken on your network?** Use the **dashboard** + **GitHub Actions** paths below — no `vercel link` required.

---

## Step 1 — Neon (5 min)

1. [console.neon.tech](https://console.neon.tech) → same account as Pacific Luxe.
2. **New project** → name `warwick-bethel-retreat`.
3. Copy **pooled** connection string (production branch).
4. Save as `NEON_DATABASE_URL` — you will paste into Render only.

---

## Step 2 — Render API (10 min)

### Option A — Blueprint (fastest)

1. [dashboard.render.com](https://dashboard.render.com) → **New +** → **Blueprint**.
2. Connect repo **WarwickBethelRetreat** (this repo) → branch `main`.
3. Render reads root **`render.yaml`** → creates **`warwick-retreat-api`**.
4. When prompted, set **manual** env vars:
   - `ConnectionStrings__DefaultConnection` = your **Neon** URL from Step 1
   - `FRONTEND_URL` = *(Step 3 Vercel URL — come back after)*
5. Save **generated** `AdminSeed__Password` from Render env (or set your own before deploy).
6. Wait for deploy → copy service URL: `https://warwick-retreat-api.onrender.com` (yours may differ).

### Verify

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://YOUR-API.onrender.com/health
# 200
```

---

## Step 3 — Vercel site (5 min) — no CLI

1. [vercel.com/new](https://vercel.com/new) → import **WarwickBethelRetreat** (this repository).
2. **Root Directory:** `.` (leave as repository root)
3. **Environment Variables** (Production):

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_API_BASE_URL` | `https://YOUR-API.onrender.com` |
| `INTERNAL_API_URL` | same |
| `NEXT_PUBLIC_APP_URL` | *(Vercel assigns — update after first deploy)* |
| `NEXT_PUBLIC_APP_NAME` | `Warwick Bethel Retreat` |

4. **Deploy** → open production URL.

---

## Step 4 — Connect CORS (2 min)

Render → **warwick-retreat-api** → **Environment**:

```text
FRONTEND_URL=https://your-project.vercel.app
```

**Redeploy** API.

Test: `/book` on Vercel + `/admin/login` with admin email/password from Render `AdminSeed__*`.

---

## Step 5 — Local bootstrap file (optional)

```bash
cd /path/to/PacificLuxeRentals
cp .env.deploy.example .env.deploy
# Edit .env.deploy — paste Neon URL, Render API URL, Vercel IDs from dashboards
chmod +x scripts/bootstrap-warwick-production.sh
./scripts/bootstrap-warwick-production.sh
```

Gets you `.vercel/project.json` without `vercel link`.

### Vercel IDs (dashboard)

- **Project ID:** Vercel → warwick project → Settings → General  
- **Org/Team ID:** Vercel → Team Settings → General  

### Vercel token (for CLI / GitHub Actions)

- Vercel → Account → **Tokens** → Create → put in `.env.deploy` as `VERCEL_TOKEN`

---

## Step 6 — GitHub Actions deploy (optional, fixes CLI network)

After `.env.deploy` is filled:

```bash
gh auth login
./scripts/setup-github-secrets-warwick.sh
git add .
git commit -m "Add Warwick retreat production automation"
git push origin main
```

Workflow: `.github/workflows/deploy-warwick-retreat.yml` deploys this repo on every push to `main`.

---

## What was added to the repo

| File | Purpose |
|------|---------|
| `render.yaml` | Render Blueprint for retreat API |
| `.github/workflows/deploy-warwick-retreat.yml` | Vercel deploy via GitHub (uses secrets) |
| `scripts/bootstrap-warwick-production.sh` | Local wiring without `vercel link` |
| `warwick-bethel-retreat/vercel.json` | Vercel build hints |
| `.env.deploy.example` | Secret template |
| `warwick-bethel-retreat/DEPLOYMENT.md` | Full reference |

---

## Pacific Luxe unchanged

| Product | Vercel root | Render | Neon |
|---------|-------------|--------|------|
| Pacific Luxe | `frontend/` | existing service | existing DB |
| Warwick Retreat | repo root (this repo) | `warwick-retreat-api` | **new** Neon project |

---

## Admin login

Default seed (unless you changed in Render):

- Email: `admin@warwickbethelretreat.com`
- Password: value from Render `AdminSeed__Password` (generated or your choice)
