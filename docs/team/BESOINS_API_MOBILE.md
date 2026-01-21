# 📋 Besoins API & Coordination Équipe - Application Mobile

> **Pour**: Équipe Backend + DevOps
> **De**: Développeur Mobile (React Native)
> **Date**: 20 janvier 2026
> **Deadline API**: 21 janvier 2026 (10h00)

---

## 🎯 Objectif

Ce document liste **tous les besoins techniques** de l'application mobile Smart Café pour fonctionner correctement.

**Priorité**: ⚠️ **CRITIQUE** - Sans ces endpoints, l'application mobile est bloquée.

---

## 📚 Références Complètes

### Documentation Détaillée
Toute la spécification API est disponible dans :
```
docs/solutioning/api-spec.yaml  (OpenAPI 3.0)
```

**Swagger UI**: `https://api.smartcafe.com/docs` (à déployer)

---

## 🔗 1. ENDPOINTS API REQUIS (MVP)

### Priorité P0 (Bloquant - Jour 2)

#### Authentification (MUST HAVE)
- ✅ `POST /api/v1/auth/register` - Inscription
- ✅ `POST /api/v1/auth/login` - Connexion
- ✅ `POST /api/v1/auth/refresh` - Rafraîchir JWT
- ✅ `POST /api/v1/auth/logout` - Déconnexion (révocation refresh token)

**Détails**: Voir `api-spec.yaml` lines 31-139

---

#### Produits / Menu (MUST HAVE)
- ✅ `GET /api/v1/products` - Liste produits (avec filtres category, search, available)
- ✅ `GET /api/v1/products/:id` - Détails produit

**Détails**: Voir `api-spec.yaml` lines 141-195

---

#### Commandes (MUST HAVE)
- ✅ `POST /api/v1/orders` - Créer commande
- ✅ `GET /api/v1/orders` - Liste commandes utilisateur
- ✅ `GET /api/v1/orders/:id` - Détails commande
- ✅ `PATCH /api/v1/orders/:id/cancel` - Annuler commande

**Détails**: Voir `api-spec.yaml` lines 197-350

---

#### Utilisateur (MUST HAVE)
- ✅ `GET /api/v1/users/me` - Profil utilisateur
- ✅ `POST /api/v1/users/fcm-token` - Enregistrer token FCM (notifications)

**Détails**: Voir `api-spec.yaml` lines 352-420

---

### Priorité P1 (Nice to Have - Jour 3)
- ⚠️ `PATCH /api/v1/users/me` - Modifier profil
- ⚠️ `POST /api/v1/auth/forgot-password` - Reset password

---

## 🔐 2. AUTHENTIFICATION & SÉCURITÉ

### JWT Token Format
```json
{
  "sub": "user-uuid",
  "email": "marie@example.com",
  "iat": 1705747200,
  "exp": 1705748100
}
```

**Specs**:
- **Algorithme**: HS256 ou RS256
- **Access Token**: Expiration 15 minutes
- **Refresh Token**: Expiration 7 jours (opaque, révocable)
- **Header**: `Authorization: Bearer <jwt>`

### Endpoints Auth
| Endpoint | Input | Output | Notes |
|----------|-------|--------|-------|
| `POST /auth/register` | email, password, firstName, lastName | `{ user, token, refreshToken }` | Password: min 8 chars, 1 maj, 1 chiffre |
| `POST /auth/login` | email, password | `{ user, token, refreshToken }` | 401 si invalide |
| `POST /auth/refresh` | refreshToken | `{ token, refreshToken }` | Rotation du refresh token |
| `POST /auth/logout` | refreshToken | `{ message }` | Révoque le refresh token |

### Sécurité Requise
- ✅ **HTTPS obligatoire** (même en staging)
- ✅ **CORS** configuré pour `https://app.smartcafe.com`
- ✅ **Rate limiting**: 10 req/min (non-auth), 100 req/min (auth)
- ✅ **Validation input** côté serveur (email format, password strength)

---

## 💳 3. PAIEMENT STRIPE

### Configuration Requise

#### Clés Stripe (à fournir)
- **Test**: `pk_test_...` (publishable key)
- **Secret**: `sk_test_...` (ne PAS partager avec mobile)

#### Workflow Paiement
```
1. Mobile: POST /orders → Backend retourne paymentIntent.clientSecret
2. Mobile: Utilise Stripe SDK avec clientSecret
3. Mobile: Confirme paiement (via Stripe SDK)
4. Stripe: Webhook → Backend (/webhooks/stripe)
5. Backend: Met à jour order.paymentStatus = 'succeeded'
6. Backend: Envoie notification push → Mobile
```

### Endpoints
| Endpoint | Responsabilité |
|----------|----------------|
| `POST /orders` | Créer Payment Intent Stripe + Retourner clientSecret |
| `POST /webhooks/stripe` | Écouter événements Stripe (`payment_intent.succeeded`) |

### Format Response
```json
{
  "order": {
    "id": "uuid",
    "orderNumber": "ORD-2026-001234",
    "total": 12.50,
    "paymentStatus": "pending"
  },
  "paymentIntent": {
    "clientSecret": "pi_xxx_secret_yyy"
  }
}
```

---

## 🔔 4. NOTIFICATIONS PUSH (Firebase FCM)

### Fichiers de Configuration Requis

**À fournir par l'équipe DevOps/Backend**:
- **iOS**: `GoogleService-Info.plist`
- **Android**: `google-services.json`

**Deadline**: 21 janvier 10h00

### Endpoint d'Enregistrement
```
POST /users/fcm-token
Authorization: Bearer <jwt>
Body: { "fcmToken": "abc123...", "platform": "ios" | "android" }
```

### Format Notifications Push (côté Backend)
```json
{
  "notification": {
    "title": "Commande prête !",
    "body": "Votre commande #ORD-2026-001 est prête à être récupérée"
  },
  "data": {
    "type": "order_status_changed",
    "orderId": "uuid",
    "status": "ready"
  }
}
```

### Types de Notifications (Backend → Mobile)
1. `order_confirmed` → "Commande confirmée"
2. `order_preparing` → "Commande en préparation"
3. `order_ready` → "Commande prête !"
4. `order_completed` → "Commande complétée"
5. `order_cancelled` → "Commande annulée"

**Déclencheurs**: Sur changement de `orders.status` (trigger DB ou manuel)

---

## 🌐 5. ENVIRONNEMENTS & URLS

### URLs Backend

| Environnement | Base URL | Notes |
|---------------|----------|-------|
| **Local** | `http://localhost:3000/api/v1` | Pour développement mobile local |
| **Staging** | `https://staging-api.smartcafe.com/api/v1` | Pour tests |
| **Production** | `https://api.smartcafe.com/api/v1` | Pour la démo finale |

### Variables d'Environnement Mobile

Fichier `.env` (à créer côté mobile):
```env
# API
API_BASE_URL=https://staging-api.smartcafe.com/api/v1

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Firebase
FIREBASE_PROJECT_ID=smart-cafe-staging

# Optional
SENTRY_DSN=https://xxx@sentry.io/yyy  # Si monitoring erreurs
```

---

## 📊 6. FORMAT DES ERREURS API

**Standard obligatoire** pour toutes les erreurs :
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Message d'erreur lisible",
    "details": {
      "field": "Description du problème"
    }
  }
}
```

### Codes HTTP Attendus
| Code | Signification | Exemple |
|------|---------------|---------|
| `200` | OK | Succès |
| `201` | Created | Ressource créée |
| `400` | Bad Request | Validation échouée |
| `401` | Unauthorized | Token manquant/invalide |
| `403` | Forbidden | Pas de droits |
| `404` | Not Found | Ressource introuvable |
| `409` | Conflict | Email déjà utilisé |
| `500` | Internal Error | Erreur serveur |

### Exemples d'Erreurs
```json
// 400 - Validation
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Données invalides",
    "details": {
      "email": "Format email invalide",
      "password": "Mot de passe trop court (min 8 caractères)"
    }
  }
}

// 401 - Token invalide
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Token JWT invalide ou expiré"
  }
}

// 404 - Produit non trouvé
{
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Le produit demandé n'existe pas",
    "details": {
      "productId": "uuid-123"
    }
  }
}
```

---

## 🧪 7. DONNÉES DE TEST

### Compte Utilisateur de Test
```
Email: test@smartcafe.com
Password: Test1234!
```

**À créer** en DB avec seed:
```sql
INSERT INTO users (email, password_hash, first_name, last_name, phone)
VALUES ('test@smartcafe.com', '$2b$10$HASH', 'Test', 'User', '+33612345678');
```

### Produits de Test (minimum 10)
Voir fichier: `docs/solutioning/database-model.md` (section Seeds)

**Minimum requis**:
- 3 Beverages (Espresso, Latte, Chai)
- 3 Food (Croissant, Bagel, Sandwich)
- 2 Desserts (Brownie, Cookie)

### Carte Bancaire de Test Stripe
```
Numéro: 4242 4242 4242 4242
Expiration: 12/34
CVC: 123
```

---

## ⏱️ 8. PERFORMANCE & LIMITES

### SLA (Service Level Agreement)
| Métrique | Cible | Critique |
|----------|-------|----------|
| **Response Time (P95)** | < 500ms | < 1s |
| **Availability** | > 99% | > 95% |
| **Uptime** | 24/7 | Heures ouvrées |

### Rate Limiting
- **Non authentifié**: 10 requêtes/minute
- **Authentifié**: 100 requêtes/minute
- **Réponse si dépassé**: `429 Too Many Requests`

### Pagination
- **Défaut**: `limit=20`
- **Maximum**: `limit=100`
- **Format**:
```json
{
  "products": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

---

## 📞 9. COORDINATION & COMMUNICATION

### Points de Contact

| Rôle | Nom | Contact |
|------|-----|---------|
| **Backend Lead** | [À remplir] | [Email/Slack] |
| **DevOps** | [À remplir] | [Email/Slack] |
| **Mobile Lead** | [À remplir] | [Email/Slack] |

### Canaux de Communication
- **Slack**: `#smart-cafe-api`
- **Stand-up quotidien**: 9h00 (15 min)
- **Blocages**: Ping direct sur Slack + créer issue GitHub

---

## ✅ CHECKLIST PRÉ-DÉVELOPPEMENT MOBILE

### Avant de commencer le code mobile (21 janvier 9h), valider :

#### Backend
- [ ] API déployée en staging (`https://staging-api.smartcafe.com`)
- [ ] Tous les endpoints MVP implémentés et testés
- [ ] Documentation Swagger accessible (`/docs`)
- [ ] Compte test créé et fonctionnel
- [ ] Produits de test en base (min 10)

#### Authentification
- [ ] JWT access token (15 min) + refresh token (7 jours)
- [ ] Endpoint `/auth/refresh` fonctionne (rotation token)
- [ ] HTTPS activé (même en staging)

#### Stripe
- [ ] Clés de test fournies (`pk_test_...`)
- [ ] Endpoint `/orders` retourne `paymentIntent.clientSecret`
- [ ] Webhook `/webhooks/stripe` configuré

#### Firebase FCM
- [ ] Fichiers de config fournis (`GoogleService-Info.plist`, `google-services.json`)
- [ ] Endpoint `/users/fcm-token` fonctionne
- [ ] Backend envoie notifications de test OK

#### Qualité
- [ ] Format d'erreurs respecté (JSON avec `error.code` et `error.message`)
- [ ] Codes HTTP cohérents (200, 201, 400, 401, 404, 500)
- [ ] CORS configuré pour origine mobile

---

## 🚨 BLOQUANTS IDENTIFIÉS

### Si Backend Pas Prêt à Temps

**Plan B: Mock API**

Utiliser JSON Server ou MSW (Mock Service Worker):
```bash
npm install -g json-server
json-server --watch db.json --port 3000
```

Fichier `db.json` avec données mockées (produits, utilisateurs, commandes).

**Durée estimée setup Mock**: 2h

---

## 🎯 TIMELINE COORDINATION

| Date | Heure | Milestone Backend | Impact Mobile |
|------|-------|-------------------|---------------|
| **20 jan** | 18:00 | DB + Models prêts | Mobile peut démarrer structure |
| **21 jan** | 10:00 | Auth + Products endpoints | Mobile peut coder Auth + Menu |
| **21 jan** | 16:00 | Orders endpoint + Stripe | Mobile peut coder Panier + Order |
| **22 jan** | 10:00 | Notifications FCM | Mobile peut coder Suivi temps réel |
| **22 jan** | 18:00 | Backend stable (bug fixes) | Mobile tests end-to-end |

---

## 📎 ANNEXES

### Référence Rapide API

**Auth**:
- `POST /auth/register` → `{ user, token, refreshToken }`
- `POST /auth/login` → `{ user, token, refreshToken }`
- `POST /auth/refresh` → `{ token, refreshToken }`

**Products**:
- `GET /products?category=beverage` → `{ products[], pagination }`
- `GET /products/:id` → `{ product with options }`

**Orders**:
- `POST /orders` → `{ order, paymentIntent.clientSecret }`
- `GET /orders` → `{ orders[], pagination }`
- `GET /orders/:id` → `{ order details with items }`
- `PATCH /orders/:id/cancel` → `{ order, refund }`

**User**:
- `GET /users/me` → `{ user profile }`
- `POST /users/fcm-token` → `{ message }`

---

**📅 Date de création**: 20 janvier 2026
**🔄 Dernière mise à jour**: 20 janvier 2026
**✍️ Auteur**: Mobile Lead

**⚠️ URGENT**: Lire ce document AVANT de commencer le backend !

---

## 🙏 Merci à l'Équipe Backend !

Ce projet est un **effort d'équipe**. La qualité de l'API détermine le succès de l'application mobile.

En cas de question : **Slack #smart-cafe-api** ou **Email mobile-lead@smartcafe.com**

**Bonne chance ! 🚀**
