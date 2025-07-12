#!/bin/bash
# Build simple qui évite le timeout Vite
set -e

echo "Building application..."

# Nettoyer
rm -rf dist/ || true

# Créer structure
mkdir -p dist/public

# Copier les fichiers frontend
cp -r client/src dist/public/src
cp -r client/index.html dist/public/index.html
cp -r shared dist/public/shared
cp -r uploads dist/uploads 2>/dev/null || true

# Build backend seulement
esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "Build completed successfully!"
ls -la dist/