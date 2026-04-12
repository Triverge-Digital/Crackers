#!/bin/bash
set -e

echo "=== BW Crackers — Render Build ==="

# Install dependencies (uses Render's cache for node_modules)
npm install --prefer-offline

# Run migrations
echo "Running migrations..."
npx medusa db:migrate

# Build backend only (skip admin panel rebuild if no admin changes)
echo "Building backend..."
npx medusa build --no-browser-sync 2>/dev/null || npx medusa build

echo "=== Build complete ==="
