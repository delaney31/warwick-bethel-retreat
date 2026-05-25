# Vercel — Warwick Bethel Retreat

**Project:** [warwick-bethel-retreat](https://vercel.com/delaney31s-projects/warwick-bethel-retreat)  
**Production URL:** https://warwick-bethel-retreat.vercel.app  
**API (Render):** https://warwick-bethel-retreat.onrender.com

## Required environment variables

Vercel → **Settings** → **Environment Variables** → **Production**:

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_API_BASE_URL` | `https://warwick-bethel-retreat.onrender.com` |
| `INTERNAL_API_URL` | `https://warwick-bethel-retreat.onrender.com` |
| `NEXT_PUBLIC_APP_URL` | `https://warwick-bethel-retreat.vercel.app` |
| `NEXT_PUBLIC_APP_NAME` | `Warwick Bethel Retreat` |

After saving, **Redeploy** production (Deployments → ⋯ → Redeploy).

## Connect Git (if not done)

**Settings** → **Git** → connect `delaney31/warwick-bethel-retreat`, branch `main`, root directory `.`

## Verify

1. Open https://warwick-bethel-retreat.vercel.app/book — calendar loads
2. Open https://warwick-bethel-retreat.vercel.app/admin/login — admin works
3. Admin: `admin@warwickbethelretreat.com` + password from local `.env.deploy` (`ADMIN_SEED_PASSWORD`)

Render `FRONTEND_URL` is set to your Vercel URL for CORS.
