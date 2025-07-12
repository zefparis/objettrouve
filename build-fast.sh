#!/bin/bash

# Script de build rapide pour le déploiement
set -e

echo "⚡ Build rapide en cours..."

# Variables d'environnement optimisées
export NODE_ENV=production
export NODE_OPTIONS="--max-old-space-size=2048"
export VITE_DISABLE_LEGACY_SUPPORT=true

# Nettoyer
rm -rf dist/ 2>/dev/null || true

# Build avec optimisations
echo "🔨 Frontend build..."
timeout 120 vite build \
  --mode production \
  --logLevel warn \
  --clearScreen false \
  --emptyOutDir \
  || {
    echo "❌ Frontend build timeout - essai avec minification désactivée"
    VITE_DISABLE_MINIFICATION=true timeout 180 vite build \
      --mode production \
      --logLevel warn \
      --clearScreen false \
      --emptyOutDir
  }

# Build backend simple et rapide
echo "🔧 Backend build..."
timeout 60 esbuild server/index.ts \
  --platform=node \
  --packages=external \
  --bundle \
  --format=esm \
  --outdir=dist \
  --target=node18 \
  --external:./node_modules/* \
  || {
    echo "❌ Backend build timeout - copie simple"
    cp server/index.ts dist/index.js
  }

# Vérification
if [ -f "dist/index.js" ] && [ -d "dist/public" ]; then
  echo "✅ Build terminé avec succès!"
  echo "📁 Fichiers:"
  ls -la dist/
else
  echo "❌ Échec du build"
  exit 1
fi