#!/bin/bash

# Script de déploiement simple sans build Vite
echo "🚀 Déploiement simple sans build Vite..."

# Créer structure de déploiement
mkdir -p production/public
mkdir -p production/api

# Copier les fichiers nécessaires
echo "📂 Copie des fichiers..."
cp -r client/src production/public/
cp -r client/index.html production/public/
cp -r server/*.ts production/api/
cp -r shared production/
cp -r uploads production/ 2>/dev/null || echo "Pas d'uploads"

# Créer serveur de production minimal
echo "🔧 Création du serveur de production..."
cat > production/index.js << 'EOF'
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Headers de sécurité basiques
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'ObjetsTrouvés Production'
  });
});

// Route SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ ObjetsTrouvés Production sur le port ${PORT}`);
});
EOF

# Créer package.json de production
cat > production/package.json << 'EOF'
{
  "name": "objets-trouves-production",
  "version": "1.0.0",
  "type": "commonjs",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
EOF

echo "✅ Déploiement prêt dans le dossier production/"
echo "🎯 Pour déployer: utiliser le dossier production/ comme source"