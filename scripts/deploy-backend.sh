#!/usr/bin/env bash
#
# Deploy the Medusa backend to Railway.
#
# Workflow: build the Docker image LOCALLY, push it to Docker Hub, then redeploy
# the Railway service (which is sourced from haridev111/bwcrackers-api:latest).
# NOTHING is built on Railway — we ship a ready-to-run image.
#
# Prereqs:
#   - Docker Desktop running
#   - docker login   (as the Docker Hub account that owns the image: haridev111)
#   - railway CLI logged in and linked to the bwcrackers-api service
#
# If the DB schema changed (new/edited models or migrations), run BEFORE deploy:
#   (cd bwcrackers && railway run npx medusa db:migrate)
#
set -euo pipefail

IMAGE="haridev111/bwcrackers-api:latest"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "▶ Building + pushing $IMAGE for linux/amd64 (Railway runs amd64)…"
docker buildx build --platform linux/amd64 -t "$IMAGE" --push "$ROOT"

echo "▶ Redeploying Railway service (re-pulls :latest)…"
railway redeploy --yes

echo "✅ Done. Verify: curl -s https://bwcrackers-api-production.up.railway.app/health"
