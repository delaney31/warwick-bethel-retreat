# Neon database setup — Warwick Bethel Retreat

Neon holds the **Postgres database only**. The API still runs on **Render**; Vercel is the website.

## 1. Create the Neon project (dashboard)

1. Open [console.neon.tech](https://console.neon.tech) (same account as Pacific Luxe is fine).
2. **New project** → name: `warwick-bethel-retreat`.
3. Keep the default **production** branch.
4. **Connection details** → copy the **pooled** connection string, e.g.  
   `postgresql://user:pass@ep-xxxx-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require`

Save it — you will use it in two places:

- Render: `ConnectionStrings__DefaultConnection`
- Optional local script below

> Use a **new** Neon project, not the Pacific Luxe vehicle database.

## 2. Apply schema + seed (choose one)

### Option A — From your Mac (before Render)

```bash
cd /Users/timothy.delaney/WarwickBethelRetreat
cp .env.deploy.example .env.deploy
# Edit .env.deploy — paste NEON_DATABASE_URL=postgresql://...

chmod +x scripts/setup-neon-database.sh
./scripts/setup-neon-database.sh
```

Or pass the URL directly (no file):

```bash
./scripts/setup-neon-database.sh 'postgresql://USER:PASS@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require'
```

This runs the API once against Neon: **EF migrations** + **retreat property seed** + **admin user**.

### Option B — Automatic on first Render deploy

1. Render → Blueprint or manual service from `render.yaml`.
2. Set `ConnectionStrings__DefaultConnection` = your Neon pooled URL.
3. Deploy. On startup the API runs `MigrateAsync()` and seeds (same as Option A).

## 3. Wire Render + Vercel

| Where | Variable | Value |
|-------|----------|--------|
| **Render** | `DATABASE_URL` | Neon pooled URL (from `.env.deploy`) |
| **Render** | `FRONTEND_URL` | `https://your-app.vercel.app` |
| **Vercel** | `NEXT_PUBLIC_API_BASE_URL` | `https://warwick-retreat-api.onrender.com` |
| **Vercel** | `INTERNAL_API_URL` | same |

Redeploy API after `FRONTEND_URL` is set.

## 4. Verify

```bash
curl -s https://YOUR-RENDER-API.onrender.com/health
curl -s https://YOUR-RENDER-API.onrender.com/api/vehicles/warwick-bethel-retreat
```

Admin login: `admin@warwickbethelretreat.com` + password from Render `AdminSeed__Password` (or what you used in the script).

## Troubleshooting

| Issue | Fix |
|-------|-----|
| SSL / connection refused | Use **pooled** host (`-pooler` in hostname), `sslmode=require` |
| Empty site / no property | Re-run `./scripts/setup-neon-database.sh` or redeploy Render |
| `Jwt__SigningKey` error on Render | Blueprint generates it; manual service needs 32+ char `Jwt__SigningKey` |
