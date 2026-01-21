# 🔗 Smart Café - Requirements Backend pour Intégration Mobile

> **Pour**: Équipe Backend (@ElyesGhouaiel)
> **De**: Développeur Mobile
> **Date**: 20 janvier 2026
> **Deadline**: 21 janvier 2026 (Jour 2)
> **Criticité**: 🔴 BLOQUANT

---

## 📋 Résumé Exécutif

L'application mobile React Native est **prête à 80%** mais nécessite des modifications **critiques** du backend pour fonctionner. Ce document liste les **incompatibilités identifiées** et les **actions requises**.

**Temps estimé backend**: 4-6h de développement

---

## 🔴 CRITIQUES - À Faire IMMÉDIATEMENT (Bloquant)

### 1. Ajouter Préfixe API `/api/v1/`

**Problème**: Endpoints actuels sans préfixe (`/register`, `/products`)
**Mobile attend**: `/api/v1/auth/register`, `/api/v1/products`

**Solution**:
```javascript
// server.js ou app.js
const routes = require('./routes');
app.use('/api/v1', routes); // Ajouter ce préfixe
```

**Test**:
```bash
curl http://localhost:3000/api/v1/products  # Doit fonctionner
```

---

### 2. Implémenter `/auth/refresh` avec Token Rotation

**Problème**: Endpoint manquant, refresh token non rotatif
**Mobile attend**: Rotation automatique des refresh tokens (sécurité)

**Solution**:
```javascript
// routes/auth.js
router.post('/auth/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  // 1. Vérifier refresh token en DB (table refresh_tokens)
  const storedToken = await db.get(
    'SELECT * FROM refresh_tokens WHERE token = ? AND revoked = 0',
    [refreshToken]
  );

  if (!storedToken || storedToken.expires_at < Date.now()) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }

  // 2. Générer NOUVEAUX tokens
  const newAccessToken = generateAccessToken(storedToken.user_id);
  const newRefreshToken = generateRefreshToken();

  // 3. Révoquer ancien refresh token
  await db.run('UPDATE refresh_tokens SET revoked = 1 WHERE token = ?', [refreshToken]);

  // 4. Sauvegarder nouveau refresh token
  await db.run(
    'INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES (?, ?, ?)',
    [newRefreshToken, storedToken.user_id, Date.now() + 7*24*60*60*1000]
  );

  // 5. Retourner nouveaux tokens
  res.json({
    token: newAccessToken,
    refreshToken: newRefreshToken
  });
});
```

**Table requise**:
```sql
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token TEXT NOT NULL UNIQUE,
  user_id INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  revoked INTEGER DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

### 3. Implémenter `/users/me`

**Problème**: Endpoint manquant
**Mobile attend**: Récupérer profil utilisateur connecté

**Solution**:
```javascript
// routes/users.js
router.get('/users/me', authenticateToken, async (req, res) => {
  // req.user.id est injecté par middleware authenticateToken
  const user = await db.get(
    'SELECT id, email, first_name, last_name, phone FROM users WHERE id = ?',
    [req.user.id]
  );

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    phone: user.phone
  });
});
```

**Format attendu**:
```json
{
  "id": "uuid",
  "email": "marie@example.com",
  "firstName": "Marie",
  "lastName": "Dubois",
  "phone": "+33612345678"
}
```

---

## 🟡 IMPORTANTES - À Faire J+2 (Fonctionnalités Clés)

### 4. Implémenter `/auth/logout`

**Solution**:
```javascript
router.post('/auth/logout', async (req, res) => {
  const { refreshToken } = req.body;

  // Révoquer le refresh token
  await db.run('UPDATE refresh_tokens SET revoked = 1 WHERE token = ?', [refreshToken]);

  res.json({ message: 'Logged out successfully' });
});
```

---

### 5. Implémenter `/users/fcm-token` (Notifications Push)

**Solution**:
```javascript
router.post('/users/fcm-token', authenticateToken, async (req, res) => {
  const { fcmToken } = req.body;

  await db.run(
    'UPDATE users SET fcm_token = ? WHERE id = ?',
    [fcmToken, req.user.id]
  );

  res.json({ message: 'FCM token saved' });
});
```

**Migration DB**:
```sql
ALTER TABLE users ADD COLUMN fcm_token TEXT;
```

---

### 6. Ajouter Support `options` Produits

**Problème**: Pas de personnalisation produits (lait, sucre, taille...)
**Mobile utilise**: `ProductOption[]`

**Solution 1 - Colonne JSON (Simple)**:
```sql
ALTER TABLE products ADD COLUMN options TEXT; -- JSON string

-- Exemple valeur:
-- '[{"id":"opt1","name":"Lait Oat","price":0.5,"category":"milk"}]'
```

**Solution 2 - Table Dédiée (Recommandé)**:
```sql
CREATE TABLE product_options (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  category TEXT NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

**Endpoint modifié**:
```javascript
// GET /products/:id doit retourner:
{
  "id": 1,
  "name": "Espresso",
  "price": 2.5,
  "options": [
    {"id": "opt1", "name": "Extra Shot", "price": 0.5, "category": "extra"}
  ]
}
```

---

### 7. Filtres Produits `/products?category=beverage`

**Mobile utilise**:
```
GET /products?category=beverage&available=true&search=espresso
```

**Solution**:
```javascript
router.get('/products', async (req, res) => {
  const { category, available, search } = req.query;

  let query = 'SELECT * FROM products p JOIN categories c ON p.category_id = c.id WHERE 1=1';
  const params = [];

  if (category) {
    query += ' AND c.name = ?';
    params.push(category);
  }

  if (available === 'true') {
    query += ' AND p.is_available = 1';
  }

  if (search) {
    query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  const products = await db.all(query, params);
  res.json({ products });
});
```

---

## 🟢 NICE TO HAVE - J+3 (Optionnel)

### 8. Intégration Stripe Payment

**Endpoints requis**:
```
POST /orders/:id/payment/intent   # Créer PaymentIntent
POST /orders/:id/payment/confirm  # Confirmer paiement
```

**Installation**:
```bash
npm install stripe
```

**Code**:
```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/orders/:id/payment/intent', authenticateToken, async (req, res) => {
  const order = await db.get('SELECT * FROM orders WHERE id = ?', [req.params.id]);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.total_amount * 100), // Centimes
    currency: 'eur',
    metadata: { orderId: order.id }
  });

  res.json({
    clientSecret: paymentIntent.client_secret
  });
});
```

---

### 9. WebSocket Suivi Commande Temps Réel

**Installation**:
```bash
npm install socket.io
```

**Code**:
```javascript
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  socket.on('trackOrder', (orderId) => {
    socket.join(`order-${orderId}`);
  });
});

// Quand statut commande change:
io.to(`order-${orderId}`).emit('orderStatusChanged', { status: 'preparing' });
```

---

## 📦 Format Réponses API - Standards

### Succès
```json
{
  "data": { ... },
  "message": "Success"
}
```

### Erreur
```json
{
  "error": "Error message",
  "code": "INVALID_CREDENTIALS",
  "details": { ... }
}
```

### Pagination
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

---

## 🧪 Tests de Validation

### Tests Critiques (Mobile DOIT passer ces tests)

```bash
# 1. Test préfixe API
curl http://localhost:3000/api/v1/products
# Attend: 200 OK

# 2. Test refresh token
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"xxx"}'
# Attend: {"token":"new-jwt","refreshToken":"new-refresh"}

# 3. Test /users/me
curl http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer <jwt>"
# Attend: {"id":"1","email":"test@example.com",...}

# 4. Test filtres produits
curl "http://localhost:3000/api/v1/products?category=beverage&available=true"
# Attend: {"products":[...]}
```

---

## 📞 Points de Contact

**Questions Mobile** : Voir `docs/team/BESOINS_API_MOBILE.md`
**API Spec Complète** : `docs/solutioning/api-spec.yaml` (OpenAPI 3.0)
**Schema DB Attendu** : `docs/solutioning/database-model.md`

---

## ⏱️ Timeline Backend

| Tâche | Temps | Priorité |
|-------|-------|----------|
| 1. Préfixe `/api/v1/` | 15min | 🔴 P0 |
| 2. `/auth/refresh` + rotation | 2h | 🔴 P0 |
| 3. `/users/me` | 30min | 🔴 P0 |
| 4. `/auth/logout` | 20min | 🟡 P1 |
| 5. `/users/fcm-token` | 20min | 🟡 P1 |
| 6. Product `options` | 1h | 🟡 P1 |
| 7. Filtres produits | 30min | 🟡 P1 |
| 8. Stripe payment | 2h | 🟢 P2 |
| 9. WebSocket | 1h | 🟢 P2 |

**Total Critique (P0)**: ~3h
**Total Important (P1)**: ~2h
**Total Nice-to-Have (P2)**: ~3h

---

## ✅ Checklist Validation Mobile

- [ ] Préfixe `/api/v1/` ajouté
- [ ] Endpoint `/auth/refresh` avec token rotation
- [ ] Endpoint `/users/me` retourne profil
- [ ] Endpoint `/auth/logout` révoque refresh token
- [ ] Endpoint `/users/fcm-token` sauvegarde token push
- [ ] Products ont champ `options` (JSON ou table)
- [ ] `/products` supporte filtres `?category=&available=&search=`
- [ ] Format réponses respecte standards (success/error)
- [ ] CORS configuré pour mobile (`http://localhost:19000`)
- [ ] Tests curl passent avec succès

---

**🚀 Une fois ces modifications faites, l'app mobile sera 100% fonctionnelle !**

**📧 Merci pour votre collaboration !**
*Équipe Mobile - Smart Café*
