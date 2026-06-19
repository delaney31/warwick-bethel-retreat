#!/usr/bin/env bash
# Remove legacy Render API env vars from Vercel production (Tuxedo uses same-origin /api/*).
# Usage: ./scripts/cleanup-vercel-render-env.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if [[ -f "$ROOT/.env.deploy" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT/.env.deploy"
  set +a
fi

: "${VERCEL_TOKEN:?Set VERCEL_TOKEN in .env.deploy (https://vercel.com/account/tokens)}"
: "${VERCEL_PROJECT_ID:?Set VERCEL_PROJECT_ID in .env.deploy}"
: "${VERCEL_ORG_ID:?Set VERCEL_ORG_ID in .env.deploy}"

LEGACY_VARS=(
  NEXT_PUBLIC_API_BASE_URL
  INTERNAL_API_URL
  NEXT_PUBLIC_API_URL
)

cd "$ROOT"
mkdir -p .vercel
cat > .vercel/project.json <<EOF
{"projectId":"${VERCEL_PROJECT_ID}","orgId":"${VERCEL_ORG_ID}"}
EOF

echo "→ Removing legacy Render API env vars from Vercel production…"
for var in "${LEGACY_VARS[@]}"; do
  if npx vercel env rm "$var" production --yes --token "$VERCEL_TOKEN" --scope "$VERCEL_ORG_ID" 2>/dev/null; then
    echo "   removed $var"
  else
    echo "   skip $var (not set or already removed)"
  fi
done

echo ""
echo "→ Redeploy production so builds drop inlined Render URLs:"
echo "   npx vercel deploy --prod --token \$VERCEL_TOKEN --scope $VERCEL_ORG_ID"
echo "   Or: Vercel dashboard → Deployments → Redeploy"
