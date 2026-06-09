#!/bin/bash
# Emergency setup script — run this in Codespaces recovery mode
# Usage: bash setup.sh

set -e

echo "==> Installing Node.js 22..."
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

echo "==> Node version: $(node -v)"
echo "==> npm version: $(npm -v)"

echo "==> Installing dependencies..."
npm install --legacy-peer-deps

echo "==> Copying env file..."
[ -f .env.local ] || cp .env.example .env.local

echo ""
echo "Done! Now run: npm run dev"
