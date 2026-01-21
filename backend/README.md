# 🍵 Smart Café - Documentation Backend

## 📋 Table des matières

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Architecture](#architecture)
4. [Base de données](#base-de-données)
5. [API Reference](#api-reference)
6. [Authentification](#authentification)
7. [Gestion des erreurs](#gestion-des-erreurs)

---

## Introduction

Le backend Smart Café est une API RESTful développée avec **Node.js** et **Express.js**, utilisant **SQLite** comme base de données. Cette API permet la gestion complète d'un café-restaurant connecté : utilisateurs, produits, tables et commandes.

### Stack technique

| Technologie | Version | Utilisation |
|-------------|---------|-------------|
| Node.js | 22.x | Runtime JavaScript |
| Express.js | 4.18.x | Framework web |
| SQLite3 | 5.1.x | Base de données |
| JWT | 9.0.x | Authentification |
| Bcrypt.js | 2.4.x | Hashage mots de passe |
| Swagger | 6.2.x | Documentation API |

---

## Installation

### Prérequis

- Node.js >= 18.x
- npm >= 9.x

### Étapes d'installation

```bash
# 1. Cloner le projet
git clone https://github.com/ElyesGhouaiel/Smart_Cafe.git
cd Smart_Cafe/backend

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
# Copier et modifier le fichier .env si nécessaire

# 4. Initialiser la base de données
npm run init-db

# 5. Démarrer le serveur
npm run dev     # Mode développement (avec hot-reload)
npm start       # Mode production
```

### Variables d'environnement (.env)

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=smart_cafe_secret_key_2026
JWT_EXPIRES_IN=24h
DB_PATH=./src/database/smart_cafe.db
```

---

## Architecture

```
backend/
├── src/
│   ├── config/
│   │   └── database.js         # Configuration SQLite
│   ├── controllers/
│   │   ├── auth.controller.js  # Authentification
│   │   ├── user.controller.js  # Gestion utilisateurs
│   │   ├── category.controller.js
│   │   ├── product.controller.js
│   │   ├── table.controller.js
│   │   └── order.controller.js
│   ├── middlewares/
│   │   ├── auth.js             # JWT & Autorisation
│   │   └── errorHandler.js     # Gestion erreurs
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── category.routes.js
│   │   ├── product.routes.js
│   │   ├── table.routes.js
│   │   └── order.routes.js
│   ├── database/
│   │   ├── init.js             # Script initialisation
│   │   └── smart_cafe.db       # Base de données
│   └── server.js               # Point d'entrée
├── .env
├── .gitignore
├── package.json
└── README.md
```

### Principes de conception

- **Séparation des responsabilités** : Routes → Controllers → Database
- **Middleware centralisé** : Authentification et gestion d'erreurs
- **RESTful** : Respect des conventions REST
- **SOLID** : Code modulaire et maintenable

---

## Base de données

### Schéma relationnel

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   roles     │     │   users     │     │  categories │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ id (PK)     │◄────│ role_id(FK) │     │ id (PK)     │
│ name        │     │ id (PK)     │     │ name        │
│ description │     │ email       │     │ description │
└─────────────┘     │ password    │     │ display_order│
                    │ first_name  │     └──────┬──────┘
                    │ last_name   │            │
                    └──────┬──────┘            │
                           │                   │
┌─────────────┐     ┌──────┴──────┐     ┌──────┴──────┐
│   tables    │     │   orders    │     │  products   │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ id (PK)     │◄────│ table_id(FK)│     │ id (PK)     │
│ table_number│     │ user_id(FK) │────►│ category_id │
│ capacity    │     │ id (PK)     │     │ name        │
│ status      │     │ order_number│     │ price       │
│ location    │     │ status      │     │ description │
└─────────────┘     │ total_amount│     └──────┬──────┘
                    └──────┬──────┘            │
                           │                   │
                    ┌──────┴──────┐            │
                    │ order_items │            │
                    ├─────────────┤            │
                    │ id (PK)     │            │
                    │ order_id(FK)│            │
                    │ product_id  │────────────┘
                    │ quantity    │
                    │ unit_price  │
                    └─────────────┘
```

### Tables

#### roles
| Colonne | Type | Description |
|---------|------|-------------|
| id | INTEGER (PK) | Identifiant unique |
| name | VARCHAR(50) | Nom du rôle (admin, manager, waiter, customer) |
| description | TEXT | Description du rôle |

#### users
| Colonne | Type | Description |
|---------|------|-------------|
| id | INTEGER (PK) | Identifiant unique |
| email | VARCHAR(255) | Email unique |
| password | VARCHAR(255) | Mot de passe hashé (bcrypt) |
| first_name | VARCHAR(100) | Prénom |
| last_name | VARCHAR(100) | Nom |
| phone | VARCHAR(20) | Téléphone |
| role_id | INTEGER (FK) | Référence vers roles |
| is_active | BOOLEAN | Compte actif/inactif |

#### categories
| Colonne | Type | Description |
|---------|------|-------------|
| id | INTEGER (PK) | Identifiant unique |
| name | VARCHAR(100) | Nom de la catégorie |
| description | TEXT | Description |
| image_url | VARCHAR(500) | URL de l'image |
| display_order | INTEGER | Ordre d'affichage |
| is_active | BOOLEAN | Catégorie active |

#### products
| Colonne | Type | Description |
|---------|------|-------------|
| id | INTEGER (PK) | Identifiant unique |
| name | VARCHAR(200) | Nom du produit |
| description | TEXT | Description |
| price | DECIMAL(10,2) | Prix en euros |
| image_url | VARCHAR(500) | URL de l'image |
| category_id | INTEGER (FK) | Référence vers categories |
| is_available | BOOLEAN | Disponibilité |
| preparation_time | INTEGER | Temps de préparation (min) |
| allergens | TEXT | Liste des allergènes |

#### tables
| Colonne | Type | Description |
|---------|------|-------------|
| id | INTEGER (PK) | Identifiant unique |
| table_number | INTEGER | Numéro de table unique |
| capacity | INTEGER | Nombre de places |
| status | VARCHAR(20) | available, occupied, reserved |
| location | VARCHAR(100) | Emplacement (Terrasse, Intérieur) |
| qr_code | VARCHAR(500) | QR code pour commande mobile |

#### orders
| Colonne | Type | Description |
|---------|------|-------------|
| id | INTEGER (PK) | Identifiant unique |
| order_number | VARCHAR(50) | Numéro unique (SC-YYYYMMDD-XXXX) |
| table_id | INTEGER (FK) | Référence vers tables |
| user_id | INTEGER (FK) | Référence vers users |
| status | VARCHAR(30) | pending, confirmed, preparing, ready, served, paid, cancelled |
| total_amount | DECIMAL(10,2) | Montant total |
| notes | TEXT | Notes spéciales |

#### order_items
| Colonne | Type | Description |
|---------|------|-------------|
| id | INTEGER (PK) | Identifiant unique |
| order_id | INTEGER (FK) | Référence vers orders |
| product_id | INTEGER (FK) | Référence vers products |
| quantity | INTEGER | Quantité |
| unit_price | DECIMAL(10,2) | Prix unitaire au moment de la commande |
| special_instructions | TEXT | Instructions spéciales |
| status | VARCHAR(30) | Statut de l'item |

---

## API Reference

**Base URL** : `http://localhost:3000/api`

**Documentation Swagger** : `http://localhost:3000/api-docs`

### Authentification

#### POST /api/auth/register
Inscription d'un nouvel utilisateur.

**Request Body :**
```json
{
  "email": "client@example.com",
  "password": "motdepasse123",
  "firstName": "Jean",
  "lastName": "Dupont",
  "phone": "0612345678"
}
```

**Response (201) :**
```json
{
  "success": true,
  "message": "Inscription réussie",
  "data": {
    "user": {
      "id": 2,
      "email": "client@example.com",
      "firstName": "Jean",
      "lastName": "Dupont",
      "role": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST /api/auth/login
Connexion d'un utilisateur.

**Request Body :**
```json
{
  "email": "admin@smartcafe.fr",
  "password": "admin123"
}
```

**Response (200) :**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "user": {
      "id": 1,
      "email": "admin@smartcafe.fr",
      "firstName": "Admin",
      "lastName": "SmartCafé",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Catégories

#### GET /api/categories
Récupérer toutes les catégories.

**Response (200) :**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Boissons Chaudes",
      "description": "Cafés, thés et chocolats",
      "display_order": 1
    }
  ]
}
```

#### GET /api/categories/:id
Récupérer une catégorie avec ses produits.

#### POST /api/categories 🔒
Créer une catégorie (admin/manager).

#### PUT /api/categories/:id 🔒
Modifier une catégorie.

#### DELETE /api/categories/:id 🔒
Supprimer une catégorie.

---

### Produits

#### GET /api/products
Récupérer tous les produits.

**Query Parameters :**
- `categoryId` : Filtrer par catégorie
- `available` : Filtrer par disponibilité (true/false)

**Response (200) :**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Espresso",
      "description": "Café espresso intense",
      "price": 3.50,
      "category_id": 1,
      "category_name": "Boissons Chaudes",
      "is_available": true,
      "preparation_time": 3
    }
  ]
}
```

#### GET /api/products/:id
Récupérer un produit.

#### POST /api/products 🔒
Créer un produit.

**Request Body :**
```json
{
  "name": "Mocha",
  "description": "Café au chocolat",
  "price": 5.50,
  "categoryId": 1,
  "preparationTime": 5,
  "allergens": "lait"
}
```

#### PUT /api/products/:id 🔒
Modifier un produit.

#### DELETE /api/products/:id 🔒
Supprimer un produit.

#### PATCH /api/products/:id/availability 🔒
Changer la disponibilité.

---

### Tables

#### GET /api/tables
Récupérer toutes les tables.

**Query Parameters :**
- `status` : available, occupied, reserved

**Response (200) :**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "table_number": 1,
      "capacity": 2,
      "status": "available",
      "location": "Terrasse"
    }
  ]
}
```

#### GET /api/tables/:id
Récupérer une table avec sa commande active.

#### POST /api/tables 🔒
Créer une table.

#### PUT /api/tables/:id 🔒
Modifier une table.

#### PATCH /api/tables/:id/status 🔒
Changer le statut d'une table.

#### DELETE /api/tables/:id 🔒
Supprimer une table.

---

### Commandes

#### GET /api/orders 🔒
Récupérer les commandes.

**Query Parameters :**
- `status` : pending, confirmed, preparing, ready, served, paid, cancelled
- `tableId` : Filtrer par table

#### GET /api/orders/:id 🔒
Récupérer une commande avec ses articles.

**Response (200) :**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "order_number": "SC-20260120-0001",
    "table_number": 5,
    "status": "pending",
    "total_amount": 12.50,
    "items": [
      {
        "id": 1,
        "product_name": "Cappuccino",
        "quantity": 2,
        "unit_price": 4.50,
        "special_instructions": "Sans sucre"
      },
      {
        "id": 2,
        "product_name": "Croissant",
        "quantity": 1,
        "unit_price": 3.50
      }
    ]
  }
}
```

#### POST /api/orders 🔒
Créer une commande.

**Request Body :**
```json
{
  "tableId": 5,
  "items": [
    {
      "productId": 2,
      "quantity": 2,
      "specialInstructions": "Sans sucre"
    },
    {
      "productId": 8,
      "quantity": 1
    }
  ],
  "notes": "Client pressé"
}
```

#### PATCH /api/orders/:id/status 🔒
Mettre à jour le statut.

**Request Body :**
```json
{
  "status": "preparing"
}
```

#### POST /api/orders/:id/items 🔒
Ajouter des articles à une commande existante.

#### POST /api/orders/:id/cancel 🔒
Annuler une commande.

---

### Utilisateurs

#### GET /api/users/me 🔒
Récupérer son profil.

#### GET /api/users 🔒 (admin/manager)
Lister tous les utilisateurs.

#### GET /api/users/:id 🔒 (admin/manager)
Récupérer un utilisateur.

#### PUT /api/users/:id 🔒
Modifier un utilisateur.

#### DELETE /api/users/:id 🔒 (admin)
Désactiver un utilisateur.

---

## Authentification

L'API utilise **JWT (JSON Web Tokens)** pour l'authentification.

### Utilisation

1. Obtenir un token via `/api/auth/login`
2. Inclure le token dans le header de chaque requête protégée :

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Rôles et permissions

| Rôle | Permissions |
|------|-------------|
| **admin** | Accès total, gestion des utilisateurs |
| **manager** | Gestion produits, catégories, tables, commandes |
| **waiter** | Gestion commandes, statut tables et produits |
| **customer** | Voir produits, créer/voir ses commandes |

---

## Gestion des erreurs

Toutes les erreurs suivent un format standardisé :

```json
{
  "success": false,
  "error": "Message d'erreur",
  "details": "Détails supplémentaires (optionnel)"
}
```

### Codes HTTP

| Code | Description |
|------|-------------|
| 200 | Succès |
| 201 | Ressource créée |
| 400 | Requête invalide (validation) |
| 401 | Non authentifié |
| 403 | Non autorisé (permissions) |
| 404 | Ressource non trouvée |
| 409 | Conflit (doublon) |
| 500 | Erreur serveur |

---

## Compte de test

```
Email: admin@smartcafe.fr
Mot de passe: admin123
Rôle: Administrateur
```

---

## Auteurs

Équipe Smart Café - Projet Ynov B3 - Janvier 2026
