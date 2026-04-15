#!/bin/bash

# Start both backend (Medusa) and frontend (Storefront) dev servers

trap 'kill 0' EXIT

echo "Starting BW Crackers development servers..."
echo ""

# Start backend
echo "[Backend] Starting Medusa on port 9000..."
(cd bwcrackers && yarn dev) &

# Wait a moment for the backend to begin initializing
sleep 3

# Start frontend
echo "[Frontend] Starting Vite storefront..."
(cd bwcrackers-storefront && yarn dev) &

echo ""
echo "Press Ctrl+C to stop both servers."

wait
