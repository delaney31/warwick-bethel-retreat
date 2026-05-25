#!/usr/bin/env bash
# Push Warwick Vercel deploy secrets to GitHub (requires gh auth login).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
source "$ROOT/.env.deploy"

if ! command -v gh &>/dev/null; then
  echo "Install GitHub CLI: brew install gh && gh auth login"
  exit 1
fi

gh auth status || { echo "Run: gh auth login"; exit 1; }

REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)

set_secret() {
  local name=$1 val=$2
  [[ -z "$val" ]] && echo "skip $name (empty)" && return
  echo "$val" | gh secret set "$name" --repo "$REPO"
  echo "set $name"
}

set_secret VERCEL_TOKEN "${VERCEL_TOKEN:-}"
set_secret VERCEL_ORG_ID "${VERCEL_ORG_ID:-}"
set_secret VERCEL_PROJECT_ID "${VERCEL_PROJECT_ID:-}"

echo "Done. Push to main to trigger .github/workflows/deploy-warwick-retreat.yml"
