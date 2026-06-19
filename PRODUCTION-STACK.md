# Tuxedo Retreat — production stack (current)

## Architecture (as of 2026)

```
Guest / host browser
        │
        ▼
  tuxedoretreat.com  (Vercel — repo root, Next.js 15)
        │
        ├── /api/booking/*     → Prisma → Neon Postgres
        ├── /api/admin/*       → Prisma → Neon Postgres
        └── /api/stripe/webhook → Prisma → Neon Postgres

  warwick-bethel-retreat.onrender.com  (LEGACY — optional)
        └── ASP.NET EF Core API → same Neon if DATABASE_URL shared
```

**Production does not require Render.** Booking, host dashboard, Stripe, and calendar all use **same-origin** Next.js API routes.

## Vercel environment variables

### Required

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Neon **pooled** URL for Prisma |
| `NEXT_PUBLIC_APP_URL` | `https://tuxedoretreat.com` |
| `ADMIN_PASSWORD` | Host login at `/admin/login` |
| `STRIPE_SECRET_KEY` | Checkout after approval |
| `STRIPE_WEBHOOK_SECRET` | `https://tuxedoretreat.com/api/stripe/webhook` |

### Remove if still set (legacy Render)

| Variable | Why remove |
|----------|------------|
| `NEXT_PUBLIC_API_BASE_URL` | Points admin/booking at Render instead of `/api/*` on Vercel |
| `INTERNAL_API_URL` | Same |
| `NEXT_PUBLIC_API_URL` | Same |

**How to remove:** [Vercel → warwick-bethel-retreat → Settings → Environment Variables](https://vercel.com/delaney31s-projects/warwick-bethel-retreat/settings/environment-variables) → delete the three vars above → **Redeploy** production.

After removal, the app resolves API calls to `https://tuxedoretreat.com/api` (browser) or `https://<vercel-host>/api` (SSR).

## Neon

- **Tuxedo** uses its own Neon project (e.g. `sweet-mouse-40532596` / `warwick-bethel-retreat`).
- **Pacific Luxe** uses a **separate** Neon database for vehicles — do **not** merge schemas.
- Both apps can share one Neon **account**; each project has its own compute quota on the free tier.

### Quota exceeded

Error: `Your account or project has exceeded the compute time quota`

Affects **all** connections to that Neon project (Vercel + Render + local scripts). Fix in [Neon console](https://console.neon.tech): upgrade, wait for monthly reset, or reduce wakeups (suspend Render, avoid repeated local migrations against prod).

## Render (legacy API)

| Item | Value |
|------|--------|
| Service | [warwick-bethel-retreat](https://dashboard.render.com/web/srv-d89s3abeo5us739694qg) |
| URL | `https://warwick-bethel-retreat.onrender.com` |
| Status | **Optional** — suspend to stop failure emails |

Suspending Render does **not** take down tuxedoretreat.com if Vercel `DATABASE_URL` is healthy and Render env vars are removed from Vercel.

## Audit script

```bash
chmod +x scripts/audit-production-stack.sh
./scripts/audit-production-stack.sh
```

Regenerate `VERCEL_TOKEN` at https://vercel.com/account/tokens if the script cannot list env vars.

## Pacific Luxe (separate product)

| | Pacific Luxe | Tuxedo Retreat |
|--|--------------|----------------|
| Site | pacificluxrentals.com (Vercel `frontend/`) | tuxedoretreat.com (Vercel repo root) |
| API | Render .NET (required) | Vercel `/api/*` (Render not required) |
| DB | Neon (vehicles) | Neon (retreat reservations) |
| GitHub | `pacific-luxe-direct` | `warwick-bethel-retreat` |

No consolidation of databases recommended.
