# Render API — Warwick Bethel Retreat

> **Note:** Production **tuxedoretreat.com** runs on **Vercel + Prisma** (`DATABASE_URL` on Vercel). This Render service is the **legacy .NET API**. You can **suspend** it to stop alerts if Vercel no longer points `NEXT_PUBLIC_API_BASE_URL` at Render.

Service dashboard: [warwick-bethel-retreat on Render](https://dashboard.render.com/web/srv-d89s3abeo5us739694qg)

**Public URL:** `https://warwick-bethel-retreat.onrender.com` (**.NET API**, Docker — not the Next.js site)

The frontend lives on **Vercel** (separate project, repo root). This Render service was reconfigured from Node → Docker API.

Neon database is already migrated and seeded (project `sweet-mouse-40532596`).

**Automate:** `./scripts/configure-render-deploy.sh` then `./scripts/verify-render-api.sh`

## Neon compute quota errors

If logs show:

`Your account or project has exceeded the compute time quota`

that is a **Neon billing/plan limit**, not an API bug. Retrying will not help until Neon accepts connections again.

1. Open [Neon console](https://console.neon.tech) → project **warwick-bethel-retreat** (or the project behind `DATABASE_URL`).
2. Check **Usage** / plan limits (free tier resets monthly; heavy use from Vercel + Render + local dev shares the same quota).
3. **Fix:** upgrade Neon, wait for quota reset, or reduce usage (suspend this Render service if unused; avoid local scripts hitting prod DB repeatedly).
4. After Neon is healthy, redeploy Render or run `./scripts/verify-render-api.sh`.

Both **Vercel** (Prisma) and **Render** (EF Core) use the same Neon `DATABASE_URL` if configured that way — either being down affects the database project.

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

Expect HTTP **200** on `/health` (process liveness) and `/api/vehicles/warwick-bethel-retreat`.  
Use `/health/ready` when you need to confirm Neon connectivity (includes DB check).

## Vercel (after API is 200)

| Key | Value |
|-----|--------|
| `NEXT_PUBLIC_API_BASE_URL` | `https://warwick-bethel-retreat.onrender.com` |
| `INTERNAL_API_URL` | same |

Redeploy Vercel, then set `FRONTEND_URL` on Render to match and redeploy the API again.
