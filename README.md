# 📱 Smart Café - Application Mobile React Native

> Application mobile de commande pour café haut de gamme
> **Projet Académique** - Master YNOV | 20-21 Janvier 2026

[![React Native](https://img.shields.io/badge/React%20Native-0.83-blue)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Clean Architecture](https://img.shields.io/badge/Architecture-Clean-green)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

## 🎯 Description

Smart Café permet aux clients de:
- 📋 Consulter le menu des produits en temps réel
- 🛒 Passer des commandes avec sélection de table
- 📦 Suivre leurs commandes avec statuts colorés
- 👤 Gérer leur compte utilisateur

### ✅ Fonctionnalités Implémentées

- [x] **Authentification JWT** - Login, Register, Profile
- [x] **Menu connecté** - Produits depuis API backend
- [x] **Panier local** - AsyncStorage avec calculs automatiques
- [x] **Sélection de table** - Modal avec 10 tables (obligatoire)
- [x] **Passage de commande** - API REST avec backend
- [x] **Historique** - Commandes avec statuts colorés et numéro de table
- [x] **Protection routes** - Connexion obligatoire pour accéder à l'app

---

## 🏗️ Architecture

### Clean Architecture (4 couches)

```
┌─────────────────────────────────────────┐
│         PRESENTATION LAYER              │
│  (Screens, Components, UI Logic)        │
│   - LoginScreen, MenuScreen, etc.       │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│         DOMAIN LAYER                    │
│  (Entities, Business Rules)             │
│   - Product, CartItem, Order, User      │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│      INFRASTRUCTURE LAYER               │
│  (Services, API, Storage)               │
│   - AuthService, OrderService, etc.     │
└─────────────────────────────────────────┘
```

**Principes appliqués:** SOLID, KISS, DRY, Clean Code

📖 Voir [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) pour les détails

---

## 📦 Stack Technique

### Mobile
- **Framework:** React Native 0.83
- **Langage:** TypeScript 5.0
- **Navigation:** React Navigation (simple tabs pour MVP)
- **State:** useState (local state, pas de Redux pour MVP)
- **Storage:** AsyncStorage (panier, tokens)
- **HTTP:** Axios

### Backend
- **Runtime:** Node.js + Express
- **Base de données:** SQLite
- **Authentification:** JWT
- **API:** REST

---

## 🚀 Installation & Lancement

### Prérequis
```bash
Node.js 18+
npm ou yarn
Xcode (iOS) ou Android Studio (Android)
```

### Installation
```bash
# Clone le repository
git clone <repo-url>
cd Smart_Cafe

# Backend
cd backend
npm install

# Mobile
cd ../SmartCafeMobile
npm install
cd ios && pod install && cd ..
```

### Lancement

#### Terminal 1: Backend
```bash
cd backend
npm start
# Backend → http://localhost:3000
```

#### Terminal 2: Metro Bundler
```bash
cd SmartCafeMobile
npm start
```

#### Terminal 3: Application
```bash
# iOS
npm run ios

# Android
npm run android
```

### Vérification
```bash
# Tester l'API
curl http://localhost:3000/api/products

# Devrait retourner la liste des produits
```

---

## 📱 Screens Disponibles

### Authentification
- **LoginScreen** - Connexion email/password
- **RegisterScreen** - Inscription avec validation complète
- **ProfileScreen** - Profil utilisateur et déconnexion

### Application
- **MenuScreen** - Liste des produits avec ajout au panier
- **CartScreen** - Panier + Modal sélection de table + Commander
- **OrdersScreen** - Historique avec statuts colorés

---

## 🎬 Démo Rapide

### Scénario complet (5min)

```
1. Lancer l'app → Login screen
2. Créer un compte → Register
3. Se connecter
4. Menu → Ajouter 3-4 produits au panier
5. Panier → Vérifier les totaux (sous-total + TVA)
6. Commander → Sélectionner une table (ex: Table 5)
7. Confirmer → Message de succès avec numéro de commande
8. Commandes → Voir l'historique avec Table 5 visible
9. Profile → Se déconnecter
```

📖 Voir [docs/REVIEW_COMPLETE.md](./docs/REVIEW_COMPLETE.md) pour un guide détaillé de démonstration

---

## 📚 Documentation

### Structure des docs
```
docs/
├── REVIEW_COMPLETE.md              # 📋 Guide complet de démonstration
├── ARCHITECTURE.md                  # 🏗️ Architecture détaillée
├── PROJET_FINAL.md                  # 📝 Description finale du projet
│
├── analysis/                        # Phase 1: Analysis
│   ├── business-analysis.md
│   └── personas.md
│
├── planning/                        # Phase 2: Planning
│   ├── prd.md
│   ├── timeline.md
│   └── backlog.md
│
├── solutioning/                     # Phase 3: Solutioning
│   ├── architecture.md
│   ├── database-model.md
│   └── adr/
│       ├── 001-clean-architecture.md
│       ├── 002-redux-toolkit.md
│       └── 003-jwt-authentication.md
│
├── team/                            # Coordination équipe
│   ├── MOBILE_BACKEND_FLEXIBILITY.md
│   ├── BACKEND_INTEGRATION_REQUIREMENTS.md
│   └── BESOINS_API_MOBILE.md
│
└── implementation/                  # Phase 4: Implementation
    ├── CODE_IMPLEMENTATION.md
    └── PROJET_COMPLETED.md
```

### Documents clés

#### 🎯 Pour la Review/Présentation
- **[docs/REVIEW_COMPLETE.md](./docs/REVIEW_COMPLETE.md)** - Guide complet de démonstration avec scénarios détaillés

#### 🏗️ Architecture
- **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Vue d'ensemble de l'architecture
- **[docs/solutioning/architecture.md](./docs/solutioning/architecture.md)** - Architecture technique détaillée

#### 📝 Projet
- **[docs/PROJET_FINAL.md](./docs/PROJET_FINAL.md)** - Description finale du projet

---

## 🎓 Méthodologie: BMad Method

Ce projet suit la méthodologie BMad en 4 phases:

### 1️⃣ **Analysis** (Comprendre)
- Analyse du besoin métier
- Définition des personas
- Cas d'usage

### 2️⃣ **Planning** (Planifier)
- Product Requirements Document (PRD)
- User Stories
- Backlog priorisé

### 3️⃣ **Solutioning** (Concevoir)
- Architecture Clean
- Architecture Decision Records (ADR)
- Modèle de base de données
- Spécifications API

### 4️⃣ **Implementation** (Développer)
- Développement itératif
- Tests au fur et à mesure
- Commits atomiques
- Documentation continue

---

## 🔧 Principes de Code

### KISS (Keep It Simple, Stupid)
```typescript
// Fonction simple, fait une seule chose
private static calculateTotals(items: CartItem[]) {
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const tax = subtotal * 0.2;
  const total = subtotal + tax;
  return {subtotal, tax, total};
}
```

### DRY (Don't Repeat Yourself)
```typescript
// Mappers centralisés pour éviter duplication
ProductService.mapApiProductToDomain()
OrderService.mapApiOrderToDomain()
```

### SOLID
- **Single Responsibility:** Chaque service fait une seule chose
- **Open/Closed:** Extension facile sans modification
- **Dependency Inversion:** Services dépendent d'abstractions

---

## 📊 Statistiques

### Code
- **~2500 lignes** de TypeScript
- **25+ fichiers** source
- **6 écrans** principaux
- **5 services** infrastructure
- **3 composants** réutilisables

### Git
```bash
# Voir tous les commits du projet
git log --oneline --graph

# Commits principaux:
# - ✨ Connexion Menu à l'API
# - 🐛 Fix mappers snake_case/camelCase
# - ✨ Passage de commande avec table
# - 🔒 Authentification obligatoire
# - ✨ Affichage numéro de table
```

### Temps
- **Durée:** 2 jours (20-21 Janvier 2026)
- **Équipe:** 1 développeur mobile

---

## 🐛 Bugs Connus & Corrigés

### ✅ Corrigés
1. **Product Category Mapping** - TypeError sur `category_name` → Fixed
2. **Order Display** - `#undefined`, "Invalid Date" → Fixed avec mappers

### ⚠️ Limitations connues
- Pas de paiement Stripe (prévu mais non développé pour MVP)
- Pas de notifications push (prévu mais non développé pour MVP)
- Annulation commande réservée au staff (pas côté client)

---

## 🚧 Roadmap

### Version 1.1 (Court terme)
- [ ] Tests unitaires & E2E
- [ ] Paiement Stripe
- [ ] Notifications push
- [ ] Détails des produits dans l'historique

### Version 2.0 (Long terme)
- [ ] Programme de fidélité
- [ ] Réservation de table
- [ ] Split payment
- [ ] Mode offline complet
- [ ] Thème sombre

---

## 🤝 Contribution

### Structure du projet
```
SmartCafeMobile/
├── src/
│   ├── core/              # Domain Layer (Entities)
│   ├── presentation/      # Presentation Layer (UI)
│   └── infrastructure/    # Infrastructure Layer (Services)
├── App.tsx                # Entry point
└── package.json
```

### Conventions
- **Commits:** Gitmoji + description claire (ex: `✨ Ajout feature X`)
- **Branches:** `feature/nom-feature`, `fix/nom-bug`
- **Code:** TypeScript strict, ESLint, Prettier

---

## 📞 Support

### Documentation
- **Review complète:** [docs/REVIEW_COMPLETE.md](./docs/REVIEW_COMPLETE.md)
- **Architecture:** [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- **Toute la doc:** [docs/](./docs/)

### Contact
Projet académique - Master YNOV 2026

---

## 📄 Licence

Projet académique - Master YNOV

---

**🚀 Développé avec la BMad Method | Clean Architecture | SOLID Principles**

**Date:** 20-21 Janvier 2026
