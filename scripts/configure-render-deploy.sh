#!/usr/bin/env bash
# Configure Render env vars + deploy Warwick retreat API (Docker).
# Requires: render CLI logged in (`render login`) or RENDER_API_KEY in .env.deploy
#
# Usage: ./scripts/configure-render-deploy.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SERVICE_ID="${RENDER_SERVICE_ID:-srv-d89s3abeo5us739694qg}"
API_URL="${RENDER_API_URL:-https://warwick-bethel-retreat.onrender.com}"

if [[ -f "$ROOT/.env.deploy" ]]; then
  # shellcheck disable=SC1091
  set -a
  # shellcheck disable=SC1090
  source <(grep -E '^(NEON_DATABASE_URL|JWT_SIGNING_KEY|ADMIN_SEED_PASSWORD|VERCEL_PRODUCTION_URL|RENDER_API_KEY)=' "$ROOT/.env.deploy" | sed 's/^/export /')
  set +a
fi

if [[ -z "${RENDER_API_KEY:-}" ]]; then
  if [[ -f "$HOME/.render/cli.yaml" ]]; then
    RENDER_API_KEY=$(grep 'key:' "$HOME/.render/cli.yaml" | head -1 | awk '{print $2}')
  else
    echo "Run: render login   OR set RENDER_API_KEY in .env.deploy"
    exit 1
  fi
fi

NEON_URL="${NEON_DATABASE_URL:?Set NEON_DATABASE_URL in .env.deploy}"
NEON_URL="${NEON_URL//&channel_binding=require/}"
JWT_KEY="${JWT_SIGNING_KEY:-$(openssl rand -base64 48 | tr -d '\n' | head -c 64)}"
ADMIN_PASS="${ADMIN_SEED_PASSWORD:-$(openssl rand -base64 18 | tr -d '/+=' | head -c 20)}"
FRONTEND_URL="${VERCEL_PRODUCTION_URL:-https://warwick-bethel-retreat.vercel.app}"

export NEON_URL="$NEON_URL" JWT_KEY="$JWT_KEY" ADMIN_PASS="$ADMIN_PASS" FRONTEND_URL="$FRONTEND_URL"
python3 << 'PYEOF'
import json, os
env = [
  {"key": "ASPNETCORE_ENVIRONMENT", "value": "Production"},
  {"key": "DATABASE_URL", "value": os.environ["NEON_URL"]},
  {"key": "ProductLine__Value", "value": "Retreat"},
  {"key": "SeedFleet", "value": "false"},
  {"key": "SeedRetreat", "value": "true"},
  {"key": "Jwt__SigningKey", "value": os.environ["JWT_KEY"]},
  {"key": "AdminSeed__Email", "value": "admin@warwickbethelretreat.com"},
  {"key": "AdminSeed__Password", "value": os.environ["ADMIN_PASS"]},
  {"key": "FRONTEND_URL", "value": os.environ["FRONTEND_URL"]},
]
open("/tmp/render-env.json", "w").write(json.dumps(env))
PYEOF

echo "→ Patching service to Docker API (api/PacificLuxe.Api)…"
/usr/bin/curl -sf -X PATCH \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  "https://api.render.com/v1/services/${SERVICE_ID}" \
  -d '{"rootDir":"api/PacificLuxe.Api","serviceDetails":{"runtime":"docker","healthCheckPath":"/health","envSpecificDetails":{"dockerfilePath":"./Dockerfile"}}}' \
  >/dev/null

echo "→ Setting environment variables…"
/usr/bin/curl -sf -X PUT \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  "https://api.render.com/v1/services/${SERVICE_ID}/env-vars" \
  -d @/tmp/render-env.json >/dev/null

echo "→ Triggering deploy…"
/usr/bin/curl -sf -X POST \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"clearCache":"clear"}' \
  "https://api.render.com/v1/services/${SERVICE_ID}/deploys" >/dev/null

rm -f /tmp/render-env.json
echo "✓ Render deploy started for $API_URL"
echo "  Admin: admin@warwickbethelretreat.com"
echo "  Password: (see ADMIN_SEED_PASSWORD in .env.deploy)"
echo "  Verify: ./scripts/verify-render-api.sh $API_URL"
