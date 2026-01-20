# Smart Café - Frontend

Application web de gestion pour le Smart Café, développée avec React.js et Vite.

## 🚀 Installation

```bash
cd frontend
npm install
```

## ⚙️ Configuration

Par défaut, l'API backend est configurée sur `http://localhost:3000/api`.

Pour modifier cette configuration, créez un fichier `.env` à la racine du dossier frontend :

```env
VITE_API_URL=http://localhost:3000/api
```

## 🏃 Lancement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 📋 Fonctionnalités

- **Dashboard** : Vue d'ensemble des statistiques du café
- **Produits** : Gestion complète du catalogue (CRUD)
- **Catégories** : Organisation des produits par catégories
- **Tables** : Gestion des tables et leur statut
- **Commandes** : Création et suivi des commandes

## 🔐 Authentification

L'application utilise JWT pour l'authentification.

**Compte de démonstration :**
- Email : `admin@smartcafe.fr`
- Mot de passe : `admin123`

## 🛠️ Technologies

- React.js 18
- React Router DOM
- Axios
- Lucide React (icônes)
- Vite

## 📁 Structure

```
frontend/
├── src/
│   ├── components/     # Composants réutilisables
│   ├── context/        # Contextes React (Auth)
│   ├── pages/          # Pages de l'application
│   ├── services/       # Services API
│   ├── App.jsx         # Composant principal
│   └── App.css         # Styles globaux
├── index.html
└── package.json
```

## 🔗 API Backend

Le frontend se connecte au backend Smart Café qui doit être lancé sur le port 3000.

Pour lancer le backend :
```bash
cd ../backend
npm install
node src/database/init.js  # Initialiser la BDD
npm start
```
