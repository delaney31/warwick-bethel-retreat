#!/usr/bin/env bash
# Apply EF migrations + retreat seed to a Neon PostgreSQL database.
#
# Usage:
#   ./scripts/setup-neon-database.sh 'postgresql://user:pass@ep-xxx-pooler.../neondb?sslmode=require'
# Or add NEON_DATABASE_URL to .env.deploy and run without arguments.
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
API_DIR="$ROOT/api/PacificLuxe.Api"

if [[ $# -ge 1 ]]; then
  NEON_URL="$1"
elif [[ -f "$ROOT/.env.deploy" ]]; then
  # shellcheck disable=SC1091
  NEON_URL="$(grep -E '^NEON_DATABASE_URL=' "$ROOT/.env.deploy" | cut -d= -f2- | tr -d '"' | tr -d "'")"
else
  echo "Usage: $0 '<neon-pooled-connection-string>'"
  echo "Or set NEON_DATABASE_URL in $ROOT/.env.deploy"
  exit 1
fi

if [[ -z "${NEON_URL:-}" ]]; then
  echo "NEON_DATABASE_URL is empty."
  exit 1
fi

if [[ "$NEON_URL" != postgresql://* ]] && [[ "$NEON_URL" != postgres://* ]]; then
  echo "Expected a postgresql:// or postgres:// Neon connection string."
  exit 1
fi

# Npgsql chokes on Neon's channel_binding query param; keep sslmode only.
NEON_URL="${NEON_URL//&channel_binding=require/}"

JWT_KEY="${JWT_SIGNING_KEY:-local-neon-migrate-only-change-in-render-32chars}"
ADMIN_PASS="${ADMIN_SEED_PASSWORD:-ChangeMeNow!2026}"

export ASPNETCORE_ENVIRONMENT=Production
# Use DATABASE_URL only — ConnectionStrings__* env vars break on '=' in ?sslmode=require.
export DATABASE_URL="$NEON_URL"
export ProductLine__Value=Retreat
export SeedFleet=false
export SeedRetreat=true
export Jwt__SigningKey="$JWT_KEY"
export AdminSeed__Email=admin@warwickbethelretreat.com
export AdminSeed__Password="$ADMIN_PASS"

PORT=5099
echo "→ Applying migrations and retreat seed to Neon (one-time startup)…"

cd "$API_DIR"
dotnet run --no-launch-profile --urls "http://127.0.0.1:$PORT" &
PID=$!

for i in $(seq 1 60); do
  if curl -sf "http://127.0.0.1:$PORT/health" >/dev/null 2>&1; then
    echo "✓ Schema ready — health check OK"
    kill "$PID" 2>/dev/null || true
    wait "$PID" 2>/dev/null || true
    echo ""
    echo "Neon database is ready. Next:"
    echo "  1. Render → warwick-retreat-api → DATABASE_URL = same Neon pooled URL (see .env.deploy)"
    echo "  2. Vercel → NEXT_PUBLIC_API_BASE_URL = your Render API URL"
    echo "  Admin: admin@warwickbethelretreat.com / (password you set: ADMIN_SEED_PASSWORD or Render AdminSeed__Password)"
    exit 0
  fi
  sleep 2
done

kill "$PID" 2>/dev/null || true
echo "Timed out waiting for API health. Check Neon URL and network, then re-run."
exit 1
