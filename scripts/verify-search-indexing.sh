#!/usr/bin/env bash
# Verify public routes return 200 and sitemap lists expected SEO URLs.
set -euo pipefail

BASE="${1:-https://tuxedoretreat.com}"
UA="Mozilla/5.0 (compatible; TuxedoRetreatIndexCheck/1.0)"

paths=(
  "/"
  "/book"
  "/lodging-near-warwick-bethel"
  "/stay-near-warwick-bethel"
  "/warwick-bethel-visitor-stay"
  "/private-room-near-warwick-ny"
  "/tuxedo-ny-retreat"
  "/tuxedo-park-ny-stay"
  "/warwick-ny-nightly-stay"
  "/bethel-visitor-guide"
  "/directions-to-warwick-bethel"
  "/robots.txt"
  "/sitemap.xml"
)

echo "Checking $BASE ..."
fail=0

for path in "${paths[@]}"; do
  code=$(curl -sS -A "$UA" -o /dev/null -w "%{http_code}" --max-time 25 "${BASE}${path}" || echo "000")
  if [[ "$code" != "200" ]]; then
    echo "FAIL $path → HTTP $code"
    fail=1
  else
    echo "OK   $path"
  fi
done

echo
echo "Sitemap SEO slug check:"
sitemap=$(curl -sS -A "$UA" --max-time 25 "${BASE}/sitemap.xml")
for slug in lodging-near-warwick-bethel stay-near-warwick-bethel warwick-bethel-visitor-stay; do
  if echo "$sitemap" | grep -q "$slug"; then
    echo "OK   sitemap contains $slug"
  else
    echo "FAIL sitemap missing $slug"
    fail=1
  fi
done

if [[ "$fail" -ne 0 ]]; then
  echo
  echo "Some checks failed."
  echo "If you see HTTP 403 with X-Vercel-Mitigated: challenge, that is normal for curl —"
  echo "Vercel bot protection blocks non-browser scripts but still allows verified crawlers (Googlebot)."
  echo "Confirm indexing in Google Search Console URL inspection, or re-run from a browser session."
  exit 1
fi

echo
echo "All checks passed."
