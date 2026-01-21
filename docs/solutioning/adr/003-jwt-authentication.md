# ADR-003: Authentification JWT avec Refresh Token

**Date**: 20 janvier 2026
**Statut**: ✅ Accepté
**Décideurs**: Tech Lead, Backend Lead
**Tags**: security, authentication, jwt

---

## Contexte

L'application Smart Café nécessite un système d'authentification pour:
- **Inscription/Connexion**: Création compte + login
- **Sécurisation API**: Seuls les utilisateurs auth peuvent commander
- **Persistance session**: L'utilisateur reste connecté entre les ouvertures d'app
- **Sécurité**: Protection contre les attaques (token replay, XSS, CSRF)

Contraintes:
- **Mobile**: Pas de cookies HTTP (React Native)
- **Performance**: Temps de réponse API < 500ms
- **Sécurité**: Conformité OWASP Mobile Top 10

---

## Décision

Nous adoptons **JWT (JSON Web Token) avec Refresh Token** pour l'authentification.

**Mécanisme**:
1. Login → Serveur retourne `accessToken` (JWT, 15 min) + `refreshToken` (opaque, 7 jours)
2. Mobile stocke les tokens dans **AsyncStorage sécurisé**
3. Chaque requête API → Header `Authorization: Bearer {accessToken}`
4. Si `accessToken` expiré (401) → Refresh automatique via `refreshToken`
5. Si `refreshToken` expiré → Logout + Redirect login

---

## Alternatives Considérées

### Alternative 1: Session-Based Auth (Cookies)
**Principe**: Le serveur crée une session, retourne un cookie `sessionId`.

**Avantages**:
- ✅ Révocation instantanée (serveur contrôle)
- ✅ Pas de données sensibles côté client

**Inconvénients**:
- ❌ **Ne fonctionne PAS avec React Native** (pas de support cookies HTTP)
- ❌ Requiert stockage serveur (Redis/DB)
- ❌ Problèmes CORS

**Verdict**: ❌ Rejeté - Incompatible React Native

---

### Alternative 2: JWT Seul (sans Refresh Token)
**Principe**: Un seul JWT avec longue expiration (ex: 30 jours).

**Avantages**:
- ✅ Simplicité (pas de refresh logic)
- ✅ Moins de requêtes API

**Inconvénients**:
- ❌ **Sécurité critique**: Si token volé, valide 30 jours (pas révocable)
- ❌ Pas de logout côté serveur
- ❌ Rotation impossible

**Verdict**: ❌ Rejeté - Risque sécurité trop élevé

---

### Alternative 3: OAuth 2.0 (Google/Facebook Login)
**Principe**: Délégation auth à un provider externe.

**Avantages**:
- ✅ UX simplifiée (1 clic)
- ✅ Pas de gestion mots de passe
- ✅ Sécurité déléguée

**Inconvénients**:
- ❌ Dépendance externe (si Google down, app bloquée)
- ❌ Setup complexe (credentials, callbacks)
- ❌ Pas adapté pour café local (clients veulent email/password)

**Verdict**: ⚠️ Pourrait être ajouté en Phase 2 (Should Have)

---

### Alternative 4: Biométrie Seule (Face ID / Touch ID)
**Principe**: Auth locale uniquement (pas de serveur).

**Avantages**:
- ✅ UX excellente (1 touch)
- ✅ Sécurité locale élevée

**Inconvénients**:
- ❌ Ne fonctionne pas pour nouvelle installation
- ❌ Pas de synchronisation multi-devices
- ❌ Requiert quand même un token pour l'API

**Verdict**: ⚠️ Biométrie = **complément** de JWT (unlock local), pas remplacement

---

## Justification de la Décision

### Pourquoi JWT + Refresh Token ?

#### ✅ 1. Compatibilité Mobile
```typescript
// ✅ Fonctionne parfaitement avec React Native
const response = await axios.post('/auth/login', { email, password });
const { accessToken, refreshToken } = response.data;

await AsyncStorage.setItem('accessToken', accessToken);
await AsyncStorage.setItem('refreshToken', refreshToken);
```

**Résultat**: Pas de dépendance aux cookies.

#### ✅ 2. Sécurité Optimale

**Access Token Court (15 min)**:
- Si volé → Valide seulement 15 min
- Limiter surface d'attaque

**Refresh Token Long (7 jours) mais Révocable**:
- Stocké côté serveur → Révocation instantanée
- Rotation à chaque refresh (token à usage unique)

```typescript
// Backend: Refresh endpoint
POST /auth/refresh
Body: { refreshToken: "abc123" }

// Vérifications:
1. Token valide ?
2. Token pas révoqué en DB ?
3. Token pas expiré ?

// → Retourne nouveau accessToken + nouveau refreshToken
// → Ancien refreshToken est invalidé
```

#### ✅ 3. Stateless API
```typescript
// Le serveur ne stocke PAS les access tokens
// → Scalabilité (pas de Redis pour chaque requête)
// → Performance (pas de lookup DB)

// JWT contient tout:
{
  "sub": "user-id-123",
  "email": "marie@example.com",
  "iat": 1705747200,
  "exp": 1705748100  // 15 min
}
```

**Bénéfice**: API peut scale horizontalement (load balancer).

#### ✅ 4. Expérience Utilisateur Fluide
```typescript
// Refresh automatique transparent
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Refresh silencieux
      const newToken = await refreshAccessToken();

      // Retry requête originale
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return axios(originalRequest);
    }

    return Promise.reject(error);
  }
);
```

**Résultat**: L'utilisateur ne voit JAMAIS d'expiration (sauf si refresh token expiré).

#### ✅ 5. Logout Sécurisé
```typescript
// Côté mobile
await AsyncStorage.removeItem('accessToken');
await AsyncStorage.removeItem('refreshToken');

// Côté serveur
POST /auth/logout
Body: { refreshToken }

// → Révoque le refresh token en DB
// → Access token expire naturellement (15 min max)
```

**Bénéfice**: Logout immédiat côté user, sécurisé côté serveur.

---

## Architecture d'Implémentation

### Flow Complet

```
┌─────────────┐
│   Mobile    │
│   (Login)   │
└──────┬──────┘
       │ POST /auth/login { email, password }
       ↓
┌─────────────┐
│   Backend   │
│   Verify    │
└──────┬──────┘
       │ Generate JWT + Refresh Token
       ↓
┌─────────────────────────────────┐
│ accessToken: JWT (15 min)       │
│ refreshToken: opaque (7 days)   │
└──────┬──────────────────────────┘
       │ Store in AsyncStorage
       ↓
┌─────────────────────┐
│   API Request       │
│   Header: Bearer JWT│
└──────┬──────────────┘
       │ 401 Unauthorized ?
       ↓
┌─────────────────────┐
│ POST /auth/refresh  │
│ { refreshToken }    │
└──────┬──────────────┘
       │ New JWT + New Refresh Token
       ↓
┌─────────────────────┐
│ Retry original req  │
└─────────────────────┘
```

### Structure de Stockage Mobile

```typescript
// infrastructure/services/AuthStorageService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_TOKEN_KEY = '@smart_cafe_access_token';
const REFRESH_TOKEN_KEY = '@smart_cafe_refresh_token';

export class AuthStorageService {
  async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    await AsyncStorage.multiSet([
      [ACCESS_TOKEN_KEY, accessToken],
      [REFRESH_TOKEN_KEY, refreshToken],
    ]);
  }

  async getAccessToken(): Promise<string | null> {
    return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  }

  async getRefreshToken(): Promise<string | null> {
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  }

  async clearTokens(): Promise<void> {
    await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);
  }
}
```

### Axios Interceptor (Auto-Refresh)

```typescript
// data/datasources/remote/api/interceptors.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import { AuthStorageService } from '../../../../infrastructure/services/AuthStorageService';

export const setupAuthInterceptors = (apiClient: AxiosInstance) => {
  const authStorage = new AuthStorageService();

  // Request: Add access token
  apiClient.interceptors.request.use(
    async config => {
      const token = await authStorage.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => Promise.reject(error)
  );

  // Response: Handle 401 (refresh)
  apiClient.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = await authStorage.getRefreshToken();

          if (!refreshToken) {
            throw new Error('No refresh token');
          }

          // Call refresh endpoint
          const { data } = await axios.post('/auth/refresh', {
            refreshToken,
          });

          // Save new tokens
          await authStorage.saveTokens(data.accessToken, data.refreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed → Logout
          await authStorage.clearTokens();
          // Navigate to login (via Redux action)
          // store.dispatch(logout());

          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};
```

---

## Sécurité

### Menaces Adressées

| Menace | Risque | Mitigation JWT + Refresh |
|--------|--------|--------------------------|
| **Token Theft** | Élevé | Access token court (15 min) + Refresh révocable |
| **XSS** | Moyen | Pas de `localStorage` web (AsyncStorage isolé par app) |
| **Man-in-the-Middle** | Élevé | HTTPS obligatoire |
| **Token Replay** | Moyen | Expiration courte + Rotation refresh token |
| **Brute Force** | Moyen | Rate limiting sur /auth/login (backend) |

### Best Practices Appliquées

1. **HTTPS Only**: Pas de requête HTTP en clair
```typescript
// infrastructure/config/env.ts
export const API_BASE_URL = __DEV__
  ? 'https://staging-api.smartcafe.com'  // HTTPS même en dev
  : 'https://api.smartcafe.com';
```

2. **Tokens en AsyncStorage** (pas de logs, pas de Redux pour éviter DevTools)
```typescript
// ❌ JAMAIS ça:
const initialState = { accessToken: 'jwt...' }; // DANGER: Visible dans Redux DevTools

// ✅ Toujours ça:
await AsyncStorage.setItem('accessToken', jwt); // Isolé
```

3. **Rotation Refresh Token**
```typescript
// Backend: À chaque /auth/refresh
const newRefreshToken = generateRefreshToken();
db.invalidate(oldRefreshToken); // Ancien token révoqué
db.save(newRefreshToken);
return { accessToken, refreshToken: newRefreshToken };
```

4. **Logout Côté Serveur**
```typescript
// Backend: POST /auth/logout
db.invalidate(refreshToken);
// → Access token expire naturellement (15 min max)
```

---

## Compromis et Contraintes

### ⚠️ Compromis Acceptés

#### 1. Stockage Refresh Token
**Problème**: Refresh token stocké localement → Risque si device compromis.
**Mitigation**:
- Utiliser `react-native-keychain` en production (stockage sécurisé OS)
- Rotation obligatoire (token à usage unique)
- Expiration 7 jours (pas 30)

#### 2. Pas de Biométrie (MVP)
**Problème**: Moins UX que Face ID.
**Mitigation**: Ajout biométrie en Phase 2 (Should Have).

---

## Conséquences

### ✅ Avantages
1. **Sécurité**: Conforme OWASP Mobile Top 10
2. **Performance**: Stateless API (scalable)
3. **UX**: Refresh transparent (pas de logout intempestif)
4. **Contrôle**: Révocation possible côté serveur

### ⚠️ Inconvénients
1. **Complexité**: Interceptor + refresh logic
2. **Délai**: 15 min si accès token volé (vs révocation instantanée)

---

## Validation

### Critères de Succès
- [ ] Login retourne accessToken + refreshToken
- [ ] Tokens stockés dans AsyncStorage
- [ ] Interceptor ajoute Authorization header
- [ ] Refresh automatique sur 401
- [ ] Logout révoque refresh token
- [ ] HTTPS obligatoire en production

### Tests de Sécurité
- [ ] Access token expire après 15 min
- [ ] Refresh token expire après 7 jours
- [ ] Ancien refresh token invalidé après refresh
- [ ] Logout révoque refresh token en DB
- [ ] Pas de token en clair dans les logs

---

## Références

- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Mobile Top 10](https://owasp.org/www-project-mobile-top-10/)
- [React Native AsyncStorage Security](https://reactnative.dev/docs/security)
- [Refresh Token Rotation](https://auth0.com/docs/secure/tokens/refresh-tokens/refresh-token-rotation)

---

**Décision finale**: ✅ **ACCEPTÉE**

**Prochaines étapes**:
1. Backend: Implémenter /auth/login, /auth/refresh, /auth/logout
2. Mobile: Créer AuthStorageService
3. Mobile: Setup Axios interceptors
4. Tests: Scénarios refresh + logout

**Auteur**: Tech Lead + Backend Lead
**Révisé par**: Security Team (optionnel), Équipe Dev
**Date de révision**: 20 janvier 2026
