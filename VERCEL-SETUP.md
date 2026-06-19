# Vercel — Tuxedo Retreat

**Project:** [warwick-bethel-retreat](https://vercel.com/delaney31s-projects/warwick-bethel-retreat)  
**Canonical production URL:** https://tuxedoretreat.com  
**Legacy deployment URL:** https://warwick-bethel-retreat.vercel.app (redirects to canonical)

See **[DOMAIN-SETUP.md](./DOMAIN-SETUP.md)** for DNS, primary domain, and redirect fixes.

See **[PRODUCTION-STACK.md](./PRODUCTION-STACK.md)** for architecture, Neon vs Render, and what to remove from Vercel.

## Production environment variables

| Variable | Value |
|----------|--------|
| `DATABASE_URL` | Neon pooled URL |
| `NEXT_PUBLIC_APP_URL` | `https://tuxedoretreat.com` |
| `NEXT_PUBLIC_APP_NAME` | `Tuxedo Retreat` |
| `ADMIN_PASSWORD` | Your host password |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` for `https://tuxedoretreat.com/api/stripe/webhook` |

### Do not set (legacy Render — remove if present)

| Variable | Action |
|----------|--------|
| `NEXT_PUBLIC_API_BASE_URL` | **Delete** from Vercel production |
| `INTERNAL_API_URL` | **Delete** |
| `NEXT_PUBLIC_API_URL` | **Delete** |

Automated cleanup (valid `VERCEL_TOKEN` in `.env.deploy`):

```bash
./scripts/cleanup-vercel-render-env.sh
```

Then redeploy production on Vercel.

## Git

**Settings → Git** → `delaney31/warwick-bethel-retreat`, branch `main`, root directory `.`

## Verify after deploy

```bash
./scripts/verify-production-domain.sh
```

Manual:

1. https://tuxedoretreat.com — loads, address bar stays on custom domain
2. https://www.tuxedoretreat.com — redirects to apex
3. https://tuxedoretreat.com/book — form + quote API on same host
4. https://tuxedoretreat.com/admin/login — host dashboard
