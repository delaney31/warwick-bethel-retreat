# Warwick Bethel Retreat

Luxury nightly stay website — **15 minutes from Warwick Bethel**.

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 15 (repo root) → deploy on **Vercel** |
| **API** | ASP.NET Core 8 in [`api/PacificLuxe.Api/`](api/PacificLuxe.Api/) → deploy on **Render** |
| **Database** | **Neon** PostgreSQL (separate from Pacific Luxe Direct) |

This repository is **standalone**. Pacific Luxe Direct vehicle rentals live in a different repo.

## Quick start (local)

**API** (port 5002):

```bash
cd api/PacificLuxe.Api
dotnet run --launch-profile retreat
```

**Frontend** (port 3000):

```bash
cp .env.example .env
npm install
npm run dev
```

## Production deploy

See **[SETUP-WARWICK-RETREAT.md](SETUP-WARWICK-RETREAT.md)** (quick) or **[DEPLOYMENT.md](DEPLOYMENT.md)** (full).

**Vercel:** Import this repo — **Root Directory:** `.` (repository root)

**Render:** New → Blueprint → this repo (`render.yaml`)

## Admin (after seed)

- `admin@warwickbethelretreat.com` / password from Render `AdminSeed__Password`
