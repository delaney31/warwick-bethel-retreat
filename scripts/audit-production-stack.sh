#!/usr/bin/env bash
# Audit Tuxedo Retreat production: Vercel vs Render vs Neon dependencies.
# Usage: ./scripts/audit-production-stack.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CANONICAL="${CANONICAL_URL:-https://tuxedoretreat.com}"
RENDER_API="${RENDER_API_URL:-https://warwick-bethel-retreat.onrender.com}"

if [[ -f "$ROOT/.env.deploy" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT/.env.deploy"
  set +a
fi

RENDER_API="${RENDER_API_URL:-$RENDER_API}"

echo "=== Tuxedo Retreat — production stack audit ==="
echo ""

check_http() {
  local label="$1"
  local url="$2"
  local expect="${3:-}"
  local code
  code=$(curl -sS -o /dev/null -w "%{http_code}" --max-time 25 "$url" 2>/dev/null || echo "000")
  if [[ -n "$expect" && "$code" == "$expect" ]]; then
    echo "OK   $label → HTTP $code ($url)"
  elif [[ "$code" =~ ^[23] ]]; then
    echo "OK   $label → HTTP $code ($url)"
  else
    echo "FAIL $label → HTTP $code ($url)"
  fi
}

echo "--- Live site (Vercel + Prisma) ---"
check_http "Booking calendar API" "$CANONICAL/api/booking/calendar?month=2026-06" ""
check_http "Admin session API" "$CANONICAL/api/admin/auth/session" ""
check_http "Homepage" "$CANONICAL/" ""

echo ""
echo "--- Legacy Render .NET API (optional — suspend if unused) ---"
check_http "Render liveness /health" "$RENDER_API/health" ""
check_http "Render DB ready /health/ready" "$RENDER_API/health/ready" ""
check_http "Render retreat vehicle" "$RENDER_API/api/vehicles/warwick-bethel-retreat" ""

echo ""
echo "--- Vercel production env (requires valid VERCEL_TOKEN) ---"
if [[ -n "${VERCEL_TOKEN:-}" && -n "${VERCEL_PROJECT_ID:-}" && -n "${VERCEL_ORG_ID:-}" ]]; then
  if npx vercel env ls production --token "$VERCEL_TOKEN" --scope "$VERCEL_ORG_ID" 2>/dev/null | tee /tmp/wbr-vercel-env.txt; then
    legacy=0
    for var in NEXT_PUBLIC_API_BASE_URL INTERNAL_API_URL NEXT_PUBLIC_API_URL; do
      if grep -q "$var" /tmp/wbr-vercel-env.txt 2>/dev/null; then
        echo "WARN Legacy Render env still set on Vercel: $var — remove it (site uses same-origin /api/*)"
        legacy=1
      fi
    done
    if [[ $legacy -eq 0 ]]; then
      echo "OK   No legacy Render API env vars on Vercel production"
    fi
    if grep -q "DATABASE_URL" /tmp/wbr-vercel-env.txt 2>/dev/null; then
      echo "OK   DATABASE_URL is set on Vercel (required for Prisma)"
    else
      echo "FAIL DATABASE_URL missing on Vercel production"
    fi
    rm -f /tmp/wbr-vercel-env.txt
  else
    echo "WARN Could not list Vercel env — regenerate VERCEL_TOKEN at https://vercel.com/account/tokens"
  fi
else
  echo "SKIP Set VERCEL_TOKEN, VERCEL_PROJECT_ID, VERCEL_ORG_ID in .env.deploy to audit Vercel env"
  echo "     Manual check: Vercel → warwick-bethel-retreat → Settings → Environment Variables"
  echo "     REMOVE if present: NEXT_PUBLIC_API_BASE_URL, INTERNAL_API_URL, NEXT_PUBLIC_API_URL"
  echo "     KEEP: DATABASE_URL, NEXT_PUBLIC_APP_URL, ADMIN_PASSWORD, STRIPE_*"
fi

echo ""
echo "--- Recommendations ---"
echo "• Production site runs on Vercel Next.js routes (/api/booking, /api/admin/*) + Neon via Prisma."
echo "• Render .NET API is legacy — suspend it to stop health alerts and reduce Neon wakeups:"
echo "  https://dashboard.render.com/web/srv-d89s3abeo5us739694qg"
echo "• Do NOT merge Tuxedo Neon with Pacific Luxe vehicle DB — separate products/schemas."
echo "• If Neon shows 'compute time quota exceeded', upgrade or wait for reset:"
echo "  https://console.neon.tech"
echo ""
echo "See PRODUCTION-STACK.md for full architecture."
