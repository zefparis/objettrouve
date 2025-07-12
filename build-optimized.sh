#!/bin/bash

# Script de build optimisé pour le déploiement Replit
set -e

echo "🚀 Démarrage du build optimisé..."

# Augmenter la mémoire Node.js
export NODE_OPTIONS="--max-old-space-size=4096"

# Nettoyer les caches
echo "🧹 Nettoyage des caches..."
rm -rf dist/ 2>/dev/null || true
rm -rf node_modules/.vite 2>/dev/null || true

# Build frontend avec optimisations
echo "🔨 Build frontend..."
NODE_ENV=production vite build --mode production

# Build backend
echo "🔧 Build backend..."
esbuild server/index.ts \
  --platform=node \
  --packages=external \
  --bundle \
  --format=esm \
  --outdir=dist \
  --minify

echo "✅ Build terminé avec succès!"

# Vérifier les fichiers générés
echo "📦 Fichiers générés:"
ls -la dist/
ls -la dist/public/ 2>/dev/null || echo "Pas de dossier public"

echo "🎉 Build prêt pour le déploiement!"