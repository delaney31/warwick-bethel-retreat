#!/usr/bin/env bash
# Verify Tuxedo Retreat production domain redirects and metadata.
# Usage: ./scripts/verify-production-domain.sh [base_url]
# Default checks warwick-bethel-retreat.vercel.app (should 308 → tuxedoretreat.com)

set -euo pipefail

CANONICAL="https://tuxedoretreat.com"
SOURCE="${1:-https://warwick-bethel-retreat.vercel.app}"
ROUTES=(
  "/"
  "/book"
  "/availability"
  "/rooms"
  "/gallery"
  "/faq"
  "/contact"
  "/admin/login"
  "/sitemap.xml"
  "/robots.txt"
)

echo "=== DNS (run at your machine) ==="
echo "Expected apex A: 76.76.21.21 (Vercel)"
dig +short tuxedoretreat.com A 2>/dev/null || true
echo "Expected www CNAME: cname.vercel-dns.com"
dig +short www.tuxedoretreat.com CNAME 2>/dev/null || true
echo ""

check_redirect() {
  local base="$1"
  local path="$2"
  local url="${base}${path}"
  local headers
  headers=$(curl -sI --max-redirs 0 "$url" 2>/dev/null || true)
  local status
  status=$(echo "$headers" | head -1)
  local location
  location=$(echo "$headers" | grep -i "^location:" | tr -d '\r' || true)

  if echo "$location" | grep -q "vercel.app" && ! echo "$location" | grep -q "tuxedoretreat.com"; then
    echo "FAIL $url"
    echo "  $status"
    echo "  $location  (still pointing at Vercel hostname — fix Vercel Domains / primary domain)"
    return 1
  fi

  if echo "$location" | grep -q "tuxedoretreat.com"; then
    echo "OK   $url → $(echo "$location" | sed 's/location: //i')"
    return 0
  fi

  if echo "$status" | grep -q "200"; then
    if [[ "$base" == "$CANONICAL" ]]; then
      echo "OK   $url (200 on canonical host)"
      return 0
    fi
    echo "WARN $url (200, no redirect to $CANONICAL)"
    return 0
  fi

  echo "??   $url"
  echo "  $status"
  [[ -n "$location" ]] && echo "  $location"
  return 0
}

echo "=== Redirect checks from: $SOURCE ==="
fail=0
for path in "${ROUTES[@]}"; do
  check_redirect "$SOURCE" "$path" || fail=1
done
echo ""

echo "=== Canonical host spot-check ==="
if curl -sf "$CANONICAL/robots.txt" 2>/dev/null | grep -q "tuxedoretreat.com"; then
  echo "OK   $CANONICAL/robots.txt references tuxedoretreat.com"
else
  echo "WARN $CANONICAL/robots.txt unreachable or wrong sitemap (fix DNS → Vercel 76.76.21.21)"
  fail=1
fi

if curl -sf "$CANONICAL/sitemap.xml" 2>/dev/null | grep -q "tuxedoretreat.com"; then
  echo "OK   $CANONICAL/sitemap.xml uses tuxedoretreat.com"
else
  echo "WARN $CANONICAL/sitemap.xml unreachable or wrong URLs"
  fail=1
fi

echo ""
if [[ $fail -eq 0 ]]; then
  echo "All automated checks passed (or warned only)."
else
  echo "Some checks failed — see DOMAIN-SETUP.md"
  exit 1
fi
