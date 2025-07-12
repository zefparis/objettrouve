#!/bin/bash

echo "🚀 Forçage du déploiement des routes d'authentification..."

# Nettoyer le cache
echo "🧹 Nettoyage du cache..."
rm -rf dist/ node_modules/.cache/ .vite/

# Rebuild complet
echo "🔧 Reconstruction complète..."
./build.sh

# Vérifier que les routes sont présentes
echo "🔍 Vérification des routes dans le build..."
if grep -q "auth/signup" dist/index.js; then
    echo "✅ Route signup trouvée dans le build"
else
    echo "❌ Route signup MANQUANTE dans le build"
    exit 1
fi

if grep -q "auth/signin" dist/index.js; then
    echo "✅ Route signin trouvée dans le build"
else
    echo "❌ Route signin MANQUANTE dans le build"
    exit 1
fi

# Créer un fichier de version pour forcer le redéploiement
echo "📦 Création d'un fichier de version..."
echo "$(date +%s)" > dist/version.txt

echo "🎉 Build prêt pour le déploiement!"
echo "📋 Prochaines étapes:"
echo "   1. Cliquez sur 'Deploy' dans Replit"
echo "   2. Attendez la fin du déploiement"
echo "   3. Testez les routes d'authentification"

ls -la dist/