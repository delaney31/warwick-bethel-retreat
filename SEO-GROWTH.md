# Tuxedo Retreat — SEO growth checklist

**Brand positioning:** Bethel visitor lodging in the **Warwick, NY area** (Tuxedo Park neighborhood) — not a general Tuxedo Park resort or Hudson Valley vacation brand.

**Canonical site:** https://tuxedoretreat.com

---

## 1. Google Search Console (indexing + sitemap)

### Add the property

1. Open [Google Search Console](https://search.google.com/search-console).
2. **Add property** → **URL prefix** → `https://tuxedoretreat.com`.
3. Verify ownership using one of:
   - **HTML tag** — copy the `content` value from Google and set Vercel env `GOOGLE_SITE_VERIFICATION`, then redeploy.
   - **DNS TXT** — add the record at your registrar (works without redeploy).

### Submit the sitemap

1. Search Console → **Sitemaps** → enter `sitemap.xml` → **Submit**.
2. Expected URLs (19 indexable pages today):

| Type | URLs |
|------|------|
| Core | `/`, `/rooms`, `/gallery`, `/availability`, `/book`, `/faq`, `/contact` |
| SEO landings (9) | `/lodging-near-warwick-bethel`, `/stay-near-warwick-bethel`, `/warwick-bethel-visitor-stay`, `/private-room-near-warwick-ny`, `/tuxedo-ny-retreat`, `/tuxedo-park-ny-stay`, `/warwick-ny-nightly-stay`, `/bethel-visitor-guide`, `/directions-to-warwick-bethel` |
| Guides | `/guides`, `/guides/where-to-stay-near-warwick-bethel`, `/guides/planning-a-visit-to-warwick-bethel`, `/guides/tuxedo-ny-vs-warwick-ny-bethel-visitors` |

### Confirm indexing

After 3–7 days, use **URL inspection** on:

- `https://tuxedoretreat.com/book`
- `https://tuxedoretreat.com/lodging-near-warwick-bethel`
- `https://tuxedoretreat.com/stay-near-warwick-bethel`

Request indexing for any “Discovered – currently not indexed” URLs.

### Verify locally

```bash
chmod +x scripts/verify-search-indexing.sh
./scripts/verify-search-indexing.sh
```

### About 403 / bot blocking

**Important:** Vercel does **not** offer an “Allow verified bots” toggle. Googlebot, Bingbot, and other [verified bots](https://vercel.com/docs/bot-management#verified-bots) are **automatically bypassed** by Attack Mode and the Bot Protection ruleset — Vercel validates them (IP ranges, reverse DNS, signatures).

That means:

- **`curl`, Lighthouse CLI, and most automated scripts will get 403** — they are not verified bots and cannot pass the JavaScript challenge. This is expected and does **not** mean Google is blocked.
- **Do not use `curl` alone to judge SEO health.** Use [Google Search Console → URL inspection](https://search.google.com/search-console) to confirm Google can fetch pages.
- For local Lighthouse, run **Chrome DevTools → Lighthouse** in a normal browser session (already past the challenge), not a headless/corporate-proxy fetch.

If you still see real indexing problems (Search Console fetch errors, not just local 403):

1. Open the project in Vercel → **Firewall** → **Bot Management**
2. **Attack Mode** — disable if you enabled it during an incident and no longer need it (verified bots still pass when on, but Attack Mode challenges all other non-browser traffic)
3. **Bot Protection** managed ruleset — try **Log** mode first to see what would be challenged; disable or tune if it is too aggressive for your traffic
4. Confirm no **Custom WAF rule** is blocking `/`, `/robots.txt`, or `/sitemap.xml`
5. Confirm DNS points to Vercel (`76.76.21.21`) and `/robots.txt` + `/sitemap.xml` return 200 in a real browser

```bash
chmod +x scripts/verify-search-indexing.sh
./scripts/verify-search-indexing.sh   # expect 403 from curl if bot protection is active — that is normal
```

---

## 2. Google Business Profile

1. Go to [Google Business Profile](https://business.google.com).
2. Create or claim a listing:
   - **Business name:** Tuxedo Retreat
   - **Category:** Bed & breakfast, Vacation home rental, or Lodging (pick closest)
   - **Service area / location:** Warwick, NY area (Tuxedo Park) — describe as **Bethel visitor lodging**
   - **Website:** `https://tuxedoretreat.com`
   - **Phone / email:** match site contact
3. Add photos from `/gallery`, hours (“By appointment” or check-in window), and a description that leads with **Warwick Bethel visitor stay**.
4. After verification, copy the public Maps URL to Vercel:

   `NEXT_PUBLIC_GOOGLE_BUSINESS_URL=https://maps.app.goo.gl/...`

5. Redeploy — the URL appears on `/contact`, footer (when configured), and JSON-LD `sameAs`.

---

## 3. Airbnb / Vrbo (optional)

Only list if you want marketplace discovery. Use copy that matches the site:

- **Title pattern:** “Bethel visitor stay · 15 min from Warwick Bethel · Tuxedo Retreat”
- **Description:** Lead with Bethel proximity; mention Tuxedo Park as the **neighborhood**, not the primary audience.
- **Link back:** Always include `https://tuxedoretreat.com/book` for direct bookings.

After listings are live:

| Env var | Example |
|---------|---------|
| `NEXT_PUBLIC_AIRBNB_LISTING_URL` | `https://www.airbnb.com/rooms/...` |
| `NEXT_PUBLIC_VRBO_LISTING_URL` | `https://www.vrbo.com/...` |

---

## 4. Bethel visitor directories & referrals

Low-cost visibility beyond your domain:

| Channel | Action |
|---------|--------|
| **JW.org / local congregation** | Share direct booking link with friends visiting Bethel (no public directory — word of mouth) |
| **Bethel visitor Facebook groups** | Post when appropriate; emphasize Warwick Bethel proximity, not Tuxedo tourism |
| **TripAdvisor / Yelp** | Optional lodging listing under Warwick, NY |
| **Hudson Valley tourism** | Skip generic “Tuxedo Park luxury” positioning — off-message for Bethel visitors |

---

## 5. Vercel env summary

| Variable | Purpose |
|----------|---------|
| `GOOGLE_SITE_VERIFICATION` | Search Console HTML tag verification |
| `NEXT_PUBLIC_GOOGLE_BUSINESS_URL` | Maps profile link + JSON-LD `sameAs` |
| `NEXT_PUBLIC_AIRBNB_LISTING_URL` | Optional marketplace link |
| `NEXT_PUBLIC_VRBO_LISTING_URL` | Optional marketplace link |
| `NEXT_PUBLIC_APP_URL` | Must be `https://tuxedoretreat.com` for canonical sitemap |

Redeploy after any env change.

---

## 6. Monthly check (5 minutes)

1. Search Console → **Performance** — clicks/impressions for “warwick bethel lodging” queries.
2. **Pages** — confirm `/book` and top SEO landings receive impressions.
3. Vercel **Analytics** — compare visitors vs prior month.
4. Update marketplace descriptions if brand copy changed on the site.
