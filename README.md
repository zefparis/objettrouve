# 🔍 Lost & Found - Plateforme de Gestion d'Objets Perdus

> Une plateforme communautaire moderne pour retrouver vos objets perdus et signaler vos trouvailles, avec géolocalisation, chat intégré et services premium.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)

## ✨ Fonctionnalités

### 🎯 Core Features
- **Déclaration d'objets** - Publiez vos objets perdus ou trouvés avec photos et description
- **Géolocalisation** - Localisez précisément sur carte interactive Google Maps
- **Chat intégré** - Messagerie sécurisée entre utilisateurs pour faciliter les retours
- **Recherche avancée** - Filtrez par catégorie, lieu, date et mots-clés
- **Notifications** - Alertes en temps réel pour les objets correspondants
- **Multi-langue** - Interface disponible en 10 langues (FR, EN, ES, PT, IT, DE, NL, ZH, JA, KO)

### 💎 Services Premium
- **Boost d'annonce** (€1.99) - Mettez en avant votre annonce pendant 7 jours
- **Badge vérifié** (€2.99) - Obtenez un badge de confiance sur votre profil
- **Photos supplémentaires** (€0.50/photo) - Ajoutez jusqu'à 5 photos par annonce
- **Rayon étendu** (€1.49) - Élargissez votre zone de recherche à 50km

### 🛡️ Administration
- **Dashboard admin** - Interface de gestion complète avec analytics
- **Modération** - Validation des annonces et gestion des utilisateurs
- **Statistiques** - Suivi des performances et revenus en temps réel
- **Remboursements** - Gestion des transactions et support client

## 🛠️ Stack Technique

### Frontend
- **React 18** avec TypeScript
- **Tailwind CSS** + **Shadcn UI** pour le design
- **Wouter** pour le routing
- **TanStack Query** pour la gestion d'état
- **i18next** pour l'internationalisation
- **Google Maps API** pour la géolocalisation

### Backend
- **Node.js** avec **Express** (TypeScript)
- **PostgreSQL** avec **Drizzle ORM**
- **Authentification** simple email/password avec bcrypt
- **Multer** pour l'upload de fichiers (limite 5MB)
- **Sessions** sécurisées avec cookies HttpOnly

### Intégrations
- **Stripe** - Paiements par carte bancaire
- **PayPal** - Paiements alternatifs
- **Google Maps** - Cartes et géolocalisation
- **Neon Database** - Base de données PostgreSQL serverless

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+ 
- PostgreSQL (ou compte Neon Database)
- Comptes API : Stripe, PayPal, Google Maps

### 1. Clonage et installation
```bash
git clone https://github.com/votre-username/lost-found-app.git
cd lost-found-app
npm install
```

### 2. Configuration environnement
Créez un fichier `.env` basé sur `.env.example` :

```env
# Base de données
DATABASE_URL=postgresql://user:password@localhost:5432/lostfound

# Authentification
SESSION_SECRET=your_random_session_secret_here

# Paiements
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Admin (requis pour l'accès admin)
VITE_ADMIN_EMAIL=admin@example.com
VITE_ADMIN_SECRET=your_secure_admin_password
```

### 3. Base de données
```bash
# Appliquer le schema
npm run db:push

# (Optionnel) Ajouter des données de test
npm run db:seed
```

### 4. Démarrage
```bash
# Développement (frontend + backend)
npm run dev

# Production build
npm run build
npm start
```

L'application sera disponible sur `http://localhost:5000`

## 📝 Scripts Disponibles

```bash
npm run dev          # Démarrage développement (Vite + Express)
npm run build        # Build production
npm run start        # Démarrage production
npm run db:push      # Synchronisation schema base de données
npm run db:studio    # Interface graphique base de données
npm run type-check   # Vérification TypeScript
npm run lint         # Analyse code ESLint
```

## 🔐 Accès Administrateur

L'accès admin est sécurisé via variables d'environnement :

1. **Configurez** `VITE_ADMIN_EMAIL` et `VITE_ADMIN_SECRET` dans votre `.env`
2. **Accédez** à `/admin` sur votre application
3. **Connectez-vous** avec vos credentials admin

### Fonctionnalités Admin
- Gestion des utilisateurs et annonces
- Statistiques et analytics en temps réel
- Modération des contenus
- Gestion des paiements et remboursements
- Configuration des services premium

## 💰 Modèle de Paiement

### Tarification à l'acte (pas d'abonnement)
| Service | Prix | Durée | Description |
|---------|------|-------|-------------|
| Boost d'annonce | €1.99 | 7 jours | Mise en avant prioritaire |
| Badge vérifié | €2.99 | Permanent | Badge de confiance |
| Photo supplémentaire | €0.50 | Permanent | Jusqu'à 5 photos/annonce |
| Rayon étendu | €1.49 | 30 jours | Zone de recherche 50km |

### Intégrations Paiement
- **Stripe** : Cartes bancaires, Apple Pay, Google Pay
- **PayPal** : Paiements PayPal et cartes via PayPal
- **Sécurité** : Chiffrement SSL, PCI DSS compliant

## 📱 Build Mobile (Android APK)

### Prérequis Capacitor
```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
```

### Build APK
```bash
# Build web assets
npm run build

# Initialize Capacitor
npx cap init "Lost Found" "com.example.lostfound"

# Add Android platform
npx cap add android

# Copy web assets
npx cap copy

# Open in Android Studio
npx cap open android
```

### Configuration APK
1. **Permissions** : Ajoutez géolocalisation et caméra dans `android/app/src/main/AndroidManifest.xml`
2. **Icons** : Placez vos icônes dans `android/app/src/main/res/`
3. **Build** : Utilisez Android Studio pour générer l'APK

## 🌍 Internationalisation

### Langues Supportées
- 🇫🇷 Français (par défaut)
- 🇬🇧 Anglais
- 🇪🇸 Espagnol
- 🇵🇹 Portugais
- 🇮🇹 Italien
- 🇩🇪 Allemand
- 🇳🇱 Néerlandais
- 🇨🇳 Chinois
- 🇯🇵 Japonais
- 🇰🇷 Coréen

### Ajouter une traduction
1. Créez `client/src/i18n/locales/[code]/translation.json`
2. Ajoutez la langue dans `client/src/i18n/index.ts`
3. Testez avec `npm run dev`

## 🏗️ Architecture du Projet

```
├── client/                 # Application React
│   ├── src/
│   │   ├── components/    # Composants réutilisables
│   │   ├── pages/         # Pages de l'application
│   │   ├── hooks/         # Hooks personnalisés
│   │   ├── lib/           # Utilitaires
│   │   └── i18n/          # Traductions
├── server/                # API Express
│   ├── routes.ts          # Routes API
│   ├── storage.ts         # Couche d'accès données
│   └── db.ts              # Configuration base de données
├── shared/                # Types partagés
│   └── schema.ts          # Schema Drizzle
└── uploads/               # Fichiers uploadés
```

## 🤝 Contributions

Les contributions sont les bienvenues ! Voici comment contribuer :

1. **Fork** le projet
2. **Créez** une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. **Committez** vos changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. **Pushez** vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. **Ouvrez** une Pull Request

### Guidelines de Contribution
- Suivez les conventions TypeScript et ESLint
- Ajoutez des tests pour les nouvelles fonctionnalités
- Documentez les changements dans le README
- Respectez le style de code existant

## 🐛 Signalement de Bugs

Pour signaler un bug :
1. Vérifiez qu'il n'existe pas déjà dans les [Issues](https://github.com/votre-username/lost-found-app/issues)
2. Créez une nouvelle issue avec :
   - Description détaillée du problème
   - Étapes pour reproduire
   - Captures d'écran si applicable
   - Informations sur votre environnement

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🚀 Déploiement

### Replit (Recommandé)
1. Importez le projet sur Replit
2. Configurez les variables d'environnement
3. Cliquez sur "Deploy" pour la production

### Autres plateformes
- **Vercel** : Idéal pour le frontend
- **Railway** : Parfait pour le backend + DB
- **Netlify** : Alternative pour le frontend

---

**Développé avec ❤️ par l'équipe [IA-Solution](https://ia-solution.com)**

*Une solution moderne pour une communauté connectée*