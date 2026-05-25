# Tuxedo Retreat — Production domain (tuxedoretreat.com)

**Canonical site:** https://tuxedoretreat.com  
**Brand:** Tuxedo Retreat (SEO copy still mentions proximity to Warwick Bethel)

---

## Production diagnosis (2026-05-25)

| Check | Result | Action |
|-------|--------|--------|
| `dig tuxedoretreat.com A` | `3.33.251.168`, `15.197.225.128` (AWS) | **Wrong** — must be Vercel `76.76.21.21` |
| `dig www.tuxedoretreat.com` | *(often missing)* | Add **CNAME** → `cname.vercel-dns.com` |
| `warwick-bethel-retreat.vercel.app/book` | 308 → `https://tuxedoretreat.com/book` | App redirects OK |
| `warwick-bethel-retreat.vercel.app/` | 308 → `warwick.bethel.retreat.vercel.app` | **Fix Vercel Domains** (dashboard redirect) |
| App env `NEXT_PUBLIC_APP_URL` | Must be `https://tuxedoretreat.com` | Set in Vercel Production + redeploy |

Until apex DNS points to Vercel, guests hitting `tuxedoretreat.com` may not reach your Next.js app.

---

## 1. Vercel custom domains

**Project:** `warwick-bethel-retreat` → [Vercel Domains](https://vercel.com/delaney31s-projects/warwick-bethel-retreat/settings/domains)

| Domain | Required behavior |
|--------|-------------------|
| `tuxedoretreat.com` | **Primary domain** — serves the site, SSL valid |
| `www.tuxedoretreat.com` | Redirect to apex (308) — app + `vercel.json` |
| `warwick-bethel-retreat.vercel.app` | Redirect to `tuxedoretreat.com` (308) |
| `warwick.bethel.retreat.vercel.app` | Redirect to `tuxedoretreat.com` (308) |

### Vercel dashboard steps

1. **Settings → Domains** → add `tuxedoretreat.com` and `www.tuxedoretreat.com` if missing.
2. Click **`tuxedoretreat.com` → Set as Primary Domain** (not `.vercel.app`).
3. Remove any rule that **redirects the custom domain to a `.vercel.app` URL** (that causes guests to leave `tuxedoretreat.com`).
4. For `www`, choose **Redirect to tuxedoretreat.com** (or let app middleware handle it).
5. **Redeploy** after env var changes.

---

## 2. DNS records (registrar)

Use the exact values Vercel shows under **Domains → DNS Records** for your project.

### Apex — `tuxedoretreat.com`

| Type | Name | Value |
|------|------|--------|
| **A** | `@` | `76.76.21.21` |

*(Or use Vercel nameservers / ALIAS to `cname.vercel-dns.com` if your registrar supports apex CNAME.)*

**Do not use** parking/AWS IPs (`3.33.x`, `15.197.x`) — those are not Vercel.

### WWW — `www.tuxedoretreat.com`

| Type | Name | Value |
|------|------|--------|
| **CNAME** | `www` | `cname.vercel-dns.com` |

### Verify DNS

```bash
dig +short tuxedoretreat.com A
# Expected: 76.76.21.21

dig +short www.tuxedoretreat.com CNAME
# Expected: cname.vercel-dns.com
```

SSL: Vercel issues certificates automatically when DNS is correct (can take up to 48h).

---

## 3. Redirect behavior (code + Vercel)

Implemented in:

- `vercel.json` — host-based 308 redirects
- `next.config.ts` — same redirects at build time
- `src/middleware.ts` + `src/lib/server/canonical-host.ts` — runtime 308 for legacy hosts

| Request | Expected |
|---------|----------|
| `https://tuxedoretreat.com/*` | **200** — stays on apex |
| `https://www.tuxedoretreat.com/*` | **308** → `https://tuxedoretreat.com/*` |
| `https://warwick-bethel-retreat.vercel.app/*` | **308** → `https://tuxedoretreat.com/*` |
| `https://warwick.bethel.retreat.vercel.app/*` | **308** → `https://tuxedoretreat.com/*` |

Run: `chmod +x scripts/verify-production-domain.sh && ./scripts/verify-production-domain.sh`

---

## 4. App configuration (Vercel Production env)

| Variable | Required value |
|----------|----------------|
| `NEXT_PUBLIC_APP_URL` | `https://tuxedoretreat.com` |
| `NEXT_PUBLIC_APP_NAME` | `Tuxedo Retreat` |
| `DATABASE_URL` | Neon pooled URL |
| `ADMIN_PASSWORD` | Host password (8+ chars) |
| `STRIPE_SECRET_KEY` | `sk_live_...` or `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | From webhook on custom domain |

**Redeploy** after any change.

### What uses `NEXT_PUBLIC_APP_URL`

- HTML canonical + Open Graph + Twitter (`src/lib/content/site-metadata.ts`)
- `/sitemap.xml`, `/robots.txt`
- Stripe Checkout success/cancel URLs (`src/lib/stripe/checkout.ts`)
- Guest payment links in admin (`getCanonicalSiteUrl()`)
- Contact mailto stays `bookings@tuxedoretreat.com`

Production code **never** emits `*.vercel.app` in URLs when `VERCEL_ENV=production`, even if env is wrong.

### Stripe webhook (production)

```
https://tuxedoretreat.com/api/stripe/webhook
```

Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`

---

## 5. Production route checklist

After DNS + Vercel primary domain + redeploy:

| Route | Expect |
|-------|--------|
| `/` | Homepage, title **Tuxedo Retreat**, URL stays on `tuxedoretreat.com` |
| `/book` | Booking form, `/api/booking/*` on same host |
| `/availability` | Calendar loads |
| `/rooms` | Rooms page |
| `/gallery` | Gallery |
| `/faq` | FAQ |
| `/contact` | Contact form |
| `/admin` | Redirect to `/admin/login` |
| `/admin/login` | Host login |
| `/sitemap.xml` | All `<loc>` URLs use `https://tuxedoretreat.com` |
| `/robots.txt` | `Sitemap: https://tuxedoretreat.com/sitemap.xml` |

### Booking sanity

- No `localhost`, no port `5002`, no Render API rewrite on `/api/booking`
- Payment copy link: `https://tuxedoretreat.com/reservations/{id}/payment`

---

## 6. Troubleshooting

| Symptom | Cause | Fix |
|---------|--------|-----|
| `tuxedoretreat.com` → `.vercel.app` | Vercel primary domain is still `.vercel.app` | Set primary to `tuxedoretreat.com` |
| `tuxedoretreat.com` 403 / wrong site | DNS not on Vercel (`dig` shows AWS IPs) | A record → `76.76.21.21` |
| `/` on `.vercel.app` → `warwick.bethel.retreat.vercel.app` | Vercel domain alias / redirect | Set primary domain; remove extra redirects |
| Sitemap shows `.vercel.app` | Old deploy or missing env | Set `NEXT_PUBLIC_APP_URL`, redeploy |
| Stripe return URL wrong | Same | Same |
