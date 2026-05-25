# Tuxedo Retreat — Custom domain (tuxedoretreat.com)

Production site: **https://tuxedoretreat.com**  
Brand: **Tuxedo Retreat** (SEO still references Warwick Bethel proximity)

---

## 1. Vercel project domains

In [Vercel](https://vercel.com) → **warwick-bethel-retreat** project → **Settings → Domains**:

| Domain | Expected behavior |
|--------|-------------------|
| `tuxedoretreat.com` | **Primary** — serves the site |
| `www.tuxedoretreat.com` | Redirects to `tuxedoretreat.com` (308) |
| `warwick-bethel-retreat.vercel.app` | Redirects to `tuxedoretreat.com` (308) — configured in `vercel.json` + middleware |

Set **Primary Domain** to `tuxedoretreat.com` (not the `.vercel.app` URL).

---

## 2. DNS at your registrar

Point DNS to Vercel (values shown in Vercel → Domains → DNS Records):

### Apex (`tuxedoretreat.com`)

Usually one of:

- **A** record → `76.76.21.21` (Vercel apex), or  
- **ALIAS / ANAME / flattened CNAME** → `cname.vercel-dns.com` (if your registrar supports apex CNAME)

### `www` (`www.tuxedoretreat.com`)

- **CNAME** → `cname.vercel-dns.com`

Wait for DNS propagation (minutes to 48 hours). Vercel will issue SSL automatically when DNS is correct.

---

## 3. Required Vercel environment variables (Production)

Update **all** environments you use (at minimum **Production**):

| Variable | Value |
|----------|--------|
| `NEXT_PUBLIC_APP_URL` | `https://tuxedoretreat.com` |
| `NEXT_PUBLIC_APP_NAME` | `Tuxedo Retreat` |
| `DATABASE_URL` | *(unchanged — Neon pooled URL)* |
| `ADMIN_PASSWORD` | *(your host password)* |
| `STRIPE_SECRET_KEY` | `sk_live_...` or `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` from webhook on **custom domain** |

**Redeploy** after changing env vars.

### Stripe webhook URL (production)

```
https://tuxedoretreat.com/api/stripe/webhook
```

Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`

---

## 4. What the app enforces in code

- **`NEXT_PUBLIC_APP_URL`** drives canonical URLs, Open Graph, sitemap, robots, Stripe success/cancel redirects, and guest payment links.
- **Middleware** + **`vercel.json`** 308-redirect:
  - `www.tuxedoretreat.com` → `tuxedoretreat.com`
  - `*.vercel.app` (legacy project URL) → `tuxedoretreat.com`
- **`getAppUrl()` / `getAppOrigin()`** no longer fall back to `VERCEL_URL` (avoids leaking the Vercel hostname in links).

---

## 5. Troubleshooting redirects

| Symptom | Likely cause | Fix |
|---------|----------------|-----|
| `tuxedoretreat.com` → `warwick-bethel-retreat.vercel.app` | Primary domain in Vercel is still `.vercel.app` | Set primary to `tuxedoretreat.com` |
| `www` shows wrong site or SSL error | Missing CNAME for `www` | Add CNAME → `cname.vercel-dns.com` |
| Payment links use Vercel URL | `NEXT_PUBLIC_APP_URL` not set / not redeployed | Set to `https://tuxedoretreat.com` and redeploy |
| Stripe redirect after pay goes to wrong host | Same as above + update Stripe webhook endpoint |

---

## 6. Production test checklist

After deploy + DNS + env vars:

- [ ] `https://tuxedoretreat.com` loads homepage; browser address stays on custom domain
- [ ] `https://www.tuxedoretreat.com` redirects to apex (308)
- [ ] `https://warwick-bethel-retreat.vercel.app` redirects to `https://tuxedoretreat.com` (308)
- [ ] Page title / navbar / footer say **Tuxedo Retreat**
- [ ] View source: canonical and `og:url` use `tuxedoretreat.com`
- [ ] `https://tuxedoretreat.com/sitemap.xml` — all URLs on `tuxedoretreat.com`
- [ ] `https://tuxedoretreat.com/robots.txt` — sitemap points to `tuxedoretreat.com`
- [ ] `/book` — form, stay package selector, live quote, submit (check admin for new reservation)
- [ ] Network tab on `/book` — API calls go to `/api/booking/*` on same host (no localhost, no port 5002, no external Render rewrite)
- [ ] `/admin/login` works; payment copy link uses `https://tuxedoretreat.com/reservations/.../payment`
- [ ] Stripe test payment → success URL on `tuxedoretreat.com`
