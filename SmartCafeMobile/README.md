# Smart Café Mobile

Application mobile React Native pour la commande et le paiement de produits dans un café.

## Démo

> **Démonstration complète de l'application mobile**

![Demo de l'application](./docs/demo.gif)

[📹 Voir la vidéo complète en haute qualité (MP4)](./docs/demo.mp4)

## Installation

```bash
npm install
cd ios && bundle install && bundle exec pod install && cd ..
```

## Lancement

```bash
npm start
npm run ios      # ou npm run android
```

## Configuration

Modifier l'URL de l'API dans `src/infrastructure/config/api.ts`:

```typescript
const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api',  // Dev
  // BASE_URL: 'https://api.smartcafe.fr/api',  // Prod
};
```

## Structure

```
src/
├── entities/           # Modèles de domaine
├── infrastructure/     # Services, API, utils
│   ├── config/        # Configuration (constants, api, env)
│   ├── services/      # Services (Auth, Product, Cart, Order)
│   └── utils/         # Helpers (formatters, validation)
└── presentation/      # UI (screens, components, navigation)
```

## Fonctionnalités

- Authentification (login/register)
- Catalogue de produits avec images
- Panier et commandes
- Profil utilisateur

## Backend

Le backend doit tourner sur `http://localhost:3000` en développement.

Voir `/backend` pour plus d'informations.
