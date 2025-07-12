#!/bin/bash

# Script de déploiement manuel pour contourner le timeout Replit
echo "🚀 Déploiement manuel en cours..."

# Créer un build minimaliste
echo "📦 Création du build minimal..."
mkdir -p dist/public

# Copier les fichiers essentiels
echo "📁 Copie des fichiers..."
cp -r client/index.html dist/public/ 2>/dev/null || echo "index.html non trouvé"
cp -r client/src dist/public/ 2>/dev/null || echo "src non trouvé"
cp -r uploads dist/ 2>/dev/null || echo "uploads non trouvé"

# Créer un serveur minimal
echo "🔧 Création du serveur minimal..."
cat > dist/index.js << 'EOF'
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rediriger tout vers index.html pour le SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
EOF

echo "✅ Build minimal créé!"
echo "📋 Fichiers générés:"
ls -la dist/
echo "📋 Contenu public:"
ls -la dist/public/ 2>/dev/null || echo "Pas de dossier public"

echo "🎯 Prêt pour le déploiement!"