#!/usr/bin/env bash
# Verify Warwick retreat API on Render.
# Usage: ./scripts/verify-render-api.sh https://your-service.onrender.com
set -euo pipefail

BASE="${1:-}"
if [[ -z "$BASE" ]]; then
  BASE="$(grep '^RENDER_API_URL=' "$(dirname "$0")/../.env.deploy" 2>/dev/null | cut -d= -f2- | tr -d '"' || true)"
fi
if [[ -z "$BASE" ]]; then
  echo "Usage: $0 https://your-service.onrender.com"
  exit 1
fi
BASE="${BASE%/}"

echo "→ $BASE/health"
code=$(curl -s -o /tmp/wbr-health.json -w "%{http_code}" --max-time 30 "$BASE/health")
echo "   HTTP $code"
[[ "$code" == "200" ]] && cat /tmp/wbr-health.json && echo ""

echo "→ $BASE/api/vehicles/warwick-bethel-retreat"
code=$(curl -s -o /tmp/wbr-vehicle.json -w "%{http_code}" --max-time 30 "$BASE/api/vehicles/warwick-bethel-retreat")
echo "   HTTP $code"
if [[ "$code" == "200" ]]; then
  head -c 300 /tmp/wbr-vehicle.json
  echo ""
  echo "✓ API is live"
  exit 0
fi

echo "✗ API not healthy. On Render (service srv-d89s3abeo5us739694qg):"
echo "  1. Environment → DATABASE_URL = Neon pooled URL (from .env.deploy NEON_DATABASE_URL)"
echo "  2. Environment → ProductLine__Value = Retreat, SeedFleet = false"
echo "  3. Redeploy → check Logs for startup errors"
exit 1
