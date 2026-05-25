# Render API — Warwick Bethel Retreat

Service dashboard: [warwick-bethel-retreat on Render](https://dashboard.render.com/web/srv-d89s3abeo5us739694qg)

**Public URL:** `https://warwick-bethel-retreat.onrender.com` (**.NET API**, Docker — not the Next.js site)

The frontend lives on **Vercel** (separate project, repo root). This Render service was reconfigured from Node → Docker API.

Neon database is already migrated and seeded (project `sweet-mouse-40532596`).

**Automate:** `./scripts/configure-render-deploy.sh` then `./scripts/verify-render-api.sh`

## Required environment variables

Render → **Environment** → add or confirm:

| Key | Value |
|-----|--------|
| `ASPNETCORE_ENVIRONMENT` | `Production` |
| `DATABASE_URL` | Neon **pooled** URL (copy from local `.env.deploy` → `NEON_DATABASE_URL`) |
| `ProductLine__Value` | `Retreat` |
| `SeedFleet` | `false` |
| `SeedRetreat` | `true` |
| `Jwt__SigningKey` | 32+ random characters (or use Render “Generate”) |
| `AdminSeed__Email` | `admin@warwickbethelretreat.com` |
| `AdminSeed__Password` | Strong password (note it for admin login) |
| `FRONTEND_URL` | Your Vercel URL when live, e.g. `https://warwick-bethel-retreat.vercel.app` |

Then **Manual Deploy** → Deploy latest commit.

## Verify

```bash
./scripts/verify-render-api.sh https://warwick-bethel-retreat.onrender.com
```

Expect HTTP **200** on `/health` and `/api/vehicles/warwick-bethel-retreat`.

## Vercel (after API is 200)

| Key | Value |
|-----|--------|
| `NEXT_PUBLIC_API_BASE_URL` | `https://warwick-bethel-retreat.onrender.com` |
| `INTERNAL_API_URL` | same |

Redeploy Vercel, then set `FRONTEND_URL` on Render to match and redeploy the API again.
