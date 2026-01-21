# 🔄 Adaptations Mobile pour Backend Actuel

> **Stratégie**: Minimiser les changements backend en adaptant le mobile
> **Date**: 20 janvier 2026
> **Approche**: Pragmatique et flexible

---

## 🎯 Objectif

Au lieu de demander **9 modifications backend**, on adapte le mobile pour fonctionner avec le backend **actuel** en faisant seulement **2-3 changements critiques côté backend**.

**Trade-off**: Moins sécurisé (pas de token rotation), mais **MVP fonctionnel rapidement** ✅

---

## ✅ Ce Qu'on Fait CÔTÉ MOBILE (Adaptations)

### 1. ✅ **Enlever le Préfixe `/api/v1/`** (FAIT)

**Mobile avant**:
```typescript
API_BASE_URL: 'http://localhost:3000/api/v1'
```

**Mobile maintenant**:
```typescript
API_BASE_URL: 'http://localhost:3000' // SANS /api/v1
```

**Fichier modifié**: `src/infrastructure/config/env.ts`

**Impact**: ✅ Compatible avec backend actuel (`/register`, `/login`, `/products`)

---

### 2. ✅ **BackendAdapter.ts** - Layer d'Adaptation (CRÉÉ)

**Nouveau fichier**: `src/data/datasources/remote/api/BackendAdapter.ts`

**Fonctionnalités**:

#### A) Transformation URLs
```typescript
transformUrl('/api/v1/auth/login') → '/login'
```

#### B) Transformation Réponses
```typescript
// Backend retourne: { user: { first_name, last_name } }
// Mobile attend: { user: { firstName, lastName } }

// L'adapter transforme automatiquement:
{
  firstName: response.data.user.first_name || response.data.user.firstName,
  lastName: response.data.user.last_name || response.data.user.lastName,
}
```

#### C) Gestion Refresh Token SANS Backend
```typescript
// Si backend n'a pas /auth/refresh, on réutilise le même token
static async refreshToken(refreshToken: string) {
  if (!BACKEND_CONFIG.hasRefreshEndpoint) {
    console.warn('No refresh endpoint, using same token');
    return {
      accessToken: refreshToken, // Même token
      refreshToken: refreshToken,
    };
  }
}
```

**Trade-off**: Token pas renouvelé automatiquement, mais **pas bloquant** pour MVP.

#### D) Gestion `/users/me` SANS Backend
```typescript
// Si backend n'a pas /users/me, on lit depuis le storage local
static async getCurrentUser() {
  if (!BACKEND_CONFIG.hasUserMeEndpoint) {
    // Infos stockées après login
    const userJson = await StorageService.get('user_profile');
    return JSON.parse(userJson);
  }
}
```

**Trade-off**: Profil pas synchronisé avec backend, mais **fonctionnel** pour affichage.

#### E) Filtres Produits Côté Client
```typescript
// Backend retourne tous les produits
// Mobile filtre côté client (category, available, search)

let products = await getAll();

if (filters?.category) {
  products = products.filter(p => p.category === filters.category);
}

if (filters?.search) {
  products = products.filter(p =>
    p.name.includes(filters.search) ||
    p.description.includes(filters.search)
  );
}
```

**Trade-off**: Moins performant pour grandes listes, mais **acceptable pour MVP** (< 100 produits).

#### F) Product Options Optionnels
```typescript
// Si backend a un champ "options" (JSON), on le parse
// Sinon, tableau vide
options: p.options ? JSON.parse(p.options) : []
```

**Trade-off**: Pas de personnalisation si backend n'a pas le champ, mais **pas d'erreur**.

---

### 3. ✅ **Stocker Profil Après Login** (À FAIRE)

```typescript
// Dans LoginUseCase ou AuthRepository
async function login(credentials) {
  const response = await BackendAdapter.login(credentials);

  // Sauvegarder profil localement
  await StorageService.saveObject('user_profile', response.user);

  return response;
}
```

**Pourquoi**: Permet d'afficher le profil sans endpoint `/users/me`

---

### 4. ✅ **Mapping category_id → category string**

**Backend**: `category_id: 1`
**Mobile**: `category: "beverage"`

```typescript
// Dans BackendAdapter
private static mapCategory(categoryId: number): string {
  const mapping = {
    '1': 'beverage',
    '2': 'food',
    '3': 'dessert',
  };
  return mapping[categoryId] || 'beverage';
}
```

---

## 🔴 Ce Qu'il Faut ABSOLUMENT Demander au Backend

### **2 Choses CRITIQUES Seulement** :

#### 1. ✅ **Retourner `refreshToken` dans `/login` et `/register`**

**Actuellement** (probablement):
```json
{
  "user": {...},
  "token": "jwt-access-token"
}
```

**Demander d'ajouter**:
```json
{
  "user": {...},
  "token": "jwt-access-token",
  "refreshToken": "same-as-token-for-now" // Peut être identique au token
}
```

**Temps**: 5 minutes de dev backend

**Code backend**:
```javascript
res.json({
  user: user,
  token: accessToken,
  refreshToken: accessToken, // Même valeur pour l'instant
});
```

---

#### 2. ⚠️ **OPTIONNEL - Field `options` dans Products**

**Si possible** (pas bloquant):
```sql
ALTER TABLE products ADD COLUMN options TEXT; -- JSON string
```

**Exemple valeur**:
```json
"[{\"id\":\"1\",\"name\":\"Lait Oat\",\"price\":0.5,\"category\":\"milk\"}]"
```

**Temps**: 30 minutes (migration + update responses)

**Avantage**: Personnalisation produits (lait, sucre, taille)

**Si non fait**: Pas grave, on désactive la personnalisation dans l'app mobile temporairement.

---

## 📊 Tableau Comparatif

| Problème | Solution Backend | Solution Mobile (Adapter) | Recommandation |
|----------|------------------|---------------------------|----------------|
| Préfixe `/api/v1/` | Ajouter préfixe (15min) | Enlever dans config (1min) | ✅ **Mobile** |
| Refresh token | Implémenter endpoint (2h) | Réutiliser même token (fait) | ✅ **Mobile** |
| `/users/me` | Créer endpoint (30min) | Lire depuis storage (10min) | ✅ **Mobile** |
| Product options | Ajouter champ (30min) | Rendre optionnel (fait) | 🟡 **Backend si temps** |
| Filtres produits | Query params (30min) | Filtrer côté client (fait) | ✅ **Mobile** |
| `refreshToken` response | Ajouter champ (5min) | Accepter fallback (fait) | 🔴 **Backend** (critique) |
| snake_case → camelCase | Pas changer (0min) | Transformer (fait) | ✅ **Mobile** |

**Total backend requis**: **5 minutes** (1 seul changement critique) 🎉
**Total mobile adapté**: **30 minutes** (déjà fait avec BackendAdapter)

---

## 🚀 Plan d'Action IMMÉDIAT

### **Vous (Mobile)** - MAINTENANT

1. ✅ **Commiter BackendAdapter** (déjà fait)
2. ✅ **Modifier env.ts** (URL sans /api/v1)
3. ⏳ **Modifier AuthRepository** pour utiliser BackendAdapter
4. ⏳ **Modifier ProductRepository** pour utiliser BackendAdapter
5. ⏳ **Sauvegarder profil après login**

**Temps total**: 30 minutes

### **Backend** - DEMAIN MATIN

1. 🔴 **Ajouter `refreshToken` dans `/login` et `/register`** (5min)

**Message à envoyer**:
```
Hey équipe backend 👋

Pour l'intégration mobile, on a adapté l'app pour être compatible avec votre API actuelle.

Il reste juste UNE SEULE chose à faire de votre côté (5 minutes):

Ajouter le champ "refreshToken" dans les réponses /login et /register:

{
  "user": {...},
  "token": "jwt",
  "refreshToken": "jwt"  // <-- Ajouter cette ligne (même valeur que token)
}

Code:
res.json({
  user: user,
  token: accessToken,
  refreshToken: accessToken, // <-- Ajouter
});

Merci ! 🙏
```

---

## ✅ Avantages de Cette Approche

1. **Rapidité** : Backend fait 5min au lieu de 3h de dev
2. **Pragmatisme** : MVP fonctionnel immédiatement
3. **Flexibilité** : Mobile s'adapte au backend actuel
4. **Evolutivité** : On peut activer les features backend progressivement

**Configuration dans BackendAdapter**:
```typescript
const BACKEND_CONFIG = {
  useApiPrefix: false,         // Pas de /api/v1
  hasRefreshEndpoint: false,   // Pas de /auth/refresh
  hasUserMeEndpoint: false,    // Pas de /users/me
};

// Plus tard, quand backend ajoute les endpoints:
const BACKEND_CONFIG = {
  useApiPrefix: true,  // Backend a ajouté /api/v1
  hasRefreshEndpoint: true,  // Backend a ajouté /auth/refresh
  hasUserMeEndpoint: true,   // Backend a ajouté /users/me
};
```

---

## ⚠️ Limitations Acceptées (MVP)

1. **Tokens pas renouvelés automatiquement** → User doit se reconnecter après expiration
2. **Profil pas synchronisé** → Changements backend pas reflétés immédiatement
3. **Filtres côté client** → Moins performant pour grandes listes (mais OK < 100 items)
4. **Pas de personnalisation produits** → Si backend n'ajoute pas `options` field

**Acceptable pour MVP** ✅
**Améliorable en Phase 2** 🔄

---

## 🎉 Résultat

**Avant**: 9 changements backend (8h de dev)
**Après**: 1 changement backend (5min de dev)

**Application mobile fonctionnelle demain matin** ! 🚀

---

**Date**: 20 janvier 2026
**Status**: ✅ Adapter créé, prêt à tester avec backend actuel
