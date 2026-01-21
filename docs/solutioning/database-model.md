# 🗄️ Modèle de Base de Données - Smart Café

> **Phase 3 de la BMad Method**: Solutioning
> **Type**: PostgreSQL (Relational)
> **Date**: 20 janvier 2026

---

## 📊 Vue d'Ensemble

### Choix de la Base de Données: **PostgreSQL**

**Justification**:
- ✅ Relations claires entre entités (Users, Products, Orders)
- ✅ ACID compliant (transactions critiques pour paiements)
- ✅ JSON support (pour options produits, adresses)
- ✅ Performance avec indexes
- ✅ Open-source et mature

**Alternative MongoDB** (rejetée pour MVP):
- ❌ Pas de transactions natives multi-documents (v4.0+)
- ❌ Moins adapté pour données relationnelles strictes
- ⚠️ Pourrait être utilisé pour cache/analytics en Phase 2

---

## 🎨 Diagramme Entité-Association (ERD)

```
┌─────────────────┐         ┌─────────────────┐
│     users       │         │    products     │
├─────────────────┤         ├─────────────────┤
│ id (PK)         │         │ id (PK)         │
│ email (unique)  │         │ name            │
│ password_hash   │         │ description     │
│ first_name      │         │ price           │
│ last_name       │         │ category        │
│ phone           │         │ image_url       │
│ created_at      │         │ available       │
│ updated_at      │         │ prep_time       │
└────────┬────────┘         │ allergens (JSON)│
         │                  │ options (JSON)  │
         │                  │ created_at      │
         │                  │ updated_at      │
         │                  └────────┬────────┘
         │                           │
         │                           │
         │                  ┌────────▼────────┐
         │                  │   order_items   │
         │                  ├─────────────────┤
         │                  │ id (PK)         │
         │                  │ order_id (FK)   │
         │                  │ product_id (FK) │
         │                  │ quantity        │
         │                  │ unit_price      │
         │                  │ options (JSON)  │
         │                  │ subtotal        │
         │                  └────────┬────────┘
         │                           │
         ▼                           │
┌─────────────────┐                 │
│     orders      │◄────────────────┘
├─────────────────┤
│ id (PK)         │
│ order_number    │
│ user_id (FK)    │
│ status          │
│ order_type      │
│ subtotal        │
│ tax             │
│ delivery_fee    │
│ total           │
│ delivery_addr   │
│ payment_id      │
│ payment_status  │
│ created_at      │
│ updated_at      │
│ completed_at    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ order_statuses  │
├─────────────────┤
│ id (PK)         │
│ order_id (FK)   │
│ status          │
│ timestamp       │
└─────────────────┘

┌─────────────────┐
│ refresh_tokens  │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ token_hash      │
│ expires_at      │
│ created_at      │
│ revoked_at      │
└─────────────────┘
```

---

## 📋 Schéma Détaillé (SQL DDL)

### Table: `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- Trigger pour updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**Contraintes**:
- `email`: Format email valide (check via backend)
- `password_hash`: Bcrypt hash (min 60 chars)
- `phone`: Optionnel, format international

**Indexes**:
- `email`: Lookup rapide pour login
- `created_at`: Tri par date d'inscription

---

### Table: `products`
```sql
CREATE TYPE product_category AS ENUM ('beverage', 'food', 'dessert');

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  category product_category NOT NULL,
  image_url VARCHAR(500),
  available BOOLEAN DEFAULT true,
  preparation_time INT DEFAULT 5 CHECK (preparation_time >= 0),
  allergens JSONB DEFAULT '[]'::jsonb,
  options JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_available ON products(available);
CREATE INDEX idx_products_name_search ON products USING GIN (to_tsvector('french', name || ' ' || description));

-- Trigger pour updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**Structure JSON `allergens`**:
```json
["gluten", "lactose", "nuts"]
```

**Structure JSON `options`**:
```json
[
  {
    "id": "size",
    "name": "Taille",
    "choices": [
      { "id": "small", "name": "Petit", "priceModifier": 0 },
      { "id": "medium", "name": "Moyen", "priceModifier": 0.5 },
      { "id": "large", "name": "Grand", "priceModifier": 1.0 }
    ]
  },
  {
    "id": "milk",
    "name": "Type de lait",
    "choices": [
      { "id": "regular", "name": "Normal", "priceModifier": 0 },
      { "id": "oat", "name": "Avoine", "priceModifier": 0.5 },
      { "id": "soy", "name": "Soja", "priceModifier": 0.5 }
    ]
  }
]
```

---

### Table: `orders`
```sql
CREATE TYPE order_status AS ENUM ('pending', 'preparing', 'ready', 'completed', 'cancelled');
CREATE TYPE order_type AS ENUM ('dine-in', 'takeaway', 'delivery');
CREATE TYPE payment_status AS ENUM ('pending', 'succeeded', 'failed', 'refunded');

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(20) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  status order_status DEFAULT 'pending',
  order_type order_type NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
  tax DECIMAL(10, 2) DEFAULT 0 CHECK (tax >= 0),
  delivery_fee DECIMAL(10, 2) DEFAULT 0 CHECK (delivery_fee >= 0),
  total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
  delivery_address JSONB,
  payment_id VARCHAR(255),  -- Stripe Payment Intent ID
  payment_status payment_status DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Trigger pour updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour générer order_number unique
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS VARCHAR AS $$
DECLARE
  new_order_number VARCHAR;
BEGIN
  new_order_number := 'ORD-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' ||
                       LPAD(nextval('order_number_seq')::TEXT, 6, '0');
  RETURN new_order_number;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE order_number_seq START 1;
```

**Structure JSON `delivery_address`** (si order_type = 'delivery'):
```json
{
  "street": "123 Rue de la Paix",
  "city": "Paris",
  "postal_code": "75001",
  "instructions": "Sonner 2 fois"
}
```

---

### Table: `order_items`
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
  options JSONB DEFAULT '[]'::jsonb,
  subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0)
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
```

**Structure JSON `options`** (sélections utilisateur):
```json
[
  { "optionId": "size", "choiceId": "large", "name": "Taille", "choiceName": "Grand", "priceModifier": 1.0 },
  { "optionId": "milk", "choiceId": "oat", "name": "Lait", "choiceName": "Avoine", "priceModifier": 0.5 }
]
```

---

### Table: `order_statuses` (Historique des changements de statut)
```sql
CREATE TABLE order_statuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status order_status NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_statuses_order_id ON order_statuses(order_id);
CREATE INDEX idx_order_statuses_timestamp ON order_statuses(timestamp);

-- Trigger pour log automatique des changements de statut
CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO order_statuses (order_id, status)
    VALUES (NEW.id, NEW.status);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_order_status
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION log_order_status_change();
```

---

### Table: `refresh_tokens`
```sql
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  revoked_at TIMESTAMP
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);
```

**Sécurité**:
- `token_hash`: Hash SHA256 du refresh token (pas de stockage en clair)
- `expires_at`: TTL 7 jours
- `revoked_at`: NULL = actif, NOT NULL = révoqué

---

## 🔄 Relations (Cardinalités)

| Relation | Type | Description |
|----------|------|-------------|
| `users` → `orders` | 1:N | Un utilisateur peut avoir plusieurs commandes |
| `orders` → `order_items` | 1:N | Une commande contient plusieurs items |
| `products` → `order_items` | 1:N | Un produit peut être dans plusieurs commandes |
| `orders` → `order_statuses` | 1:N | Une commande a un historique de statuts |
| `users` → `refresh_tokens` | 1:N | Un utilisateur peut avoir plusieurs refresh tokens (multi-devices) |

---

## 📊 Données de Test (Seeds)

### Produits Exemple
```sql
INSERT INTO products (name, description, price, category, image_url, preparation_time, allergens, options) VALUES
('Espresso', 'Café court et intense', 2.50, 'beverage', 'https://example.com/espresso.jpg', 3, '[]'::jsonb,
 '[{"id":"size","name":"Taille","choices":[{"id":"single","name":"Simple","priceModifier":0},{"id":"double","name":"Double","priceModifier":0.5}]}]'::jsonb),

('Croissant', 'Croissant pur beurre', 1.80, 'food', 'https://example.com/croissant.jpg', 0, '["gluten","lactose"]'::jsonb, '[]'::jsonb),

('Chai Latte', 'Thé épicé avec lait mousseux', 4.50, 'beverage', 'https://example.com/chai.jpg', 5,
 '["lactose"]'::jsonb,
 '[{"id":"milk","name":"Lait","choices":[{"id":"regular","name":"Normal","priceModifier":0},{"id":"oat","name":"Avoine","priceModifier":0.5}]},{"id":"size","name":"Taille","choices":[{"id":"medium","name":"Moyen","priceModifier":0},{"id":"large","name":"Grand","priceModifier":1}]}]'::jsonb);
```

### Utilisateur Test
```sql
INSERT INTO users (email, password_hash, first_name, last_name, phone) VALUES
('test@smartcafe.com', '$2b$10$HASH_HERE', 'Test', 'User', '+33612345678');
```

---

## 🔐 Sécurité & Contraintes

### Contraintes d'Intégrité
1. **Email unique**: Pas de doublons d'utilisateurs
2. **Prix positifs**: `CHECK (price >= 0)`
3. **Quantité positive**: `CHECK (quantity > 0)`
4. **Suppression protégée**:
   - `ON DELETE RESTRICT` pour products (si commande existe)
   - `ON DELETE CASCADE` pour order_items (si commande supprimée)

### Index de Performance
- **Recherche produits**: GIN index sur nom + description (full-text search)
- **Filtre par catégorie**: B-tree index sur `category`
- **Lookup utilisateur**: Index sur `email`
- **Historique commandes**: Index sur `user_id` + `created_at`

---

## 📈 Évolution Future (Hors MVP)

### Phase 2
- **Table `favorites`**: Produits favoris par utilisateur
- **Table `addresses`**: Adresses de livraison sauvegardées
- **Table `payment_methods`**: Cartes bancaires enregistrées (tokenisées Stripe)
- **Table `reviews`**: Avis clients sur produits

### Phase 3
- **Table `promotions`**: Codes promo et réductions
- **Table `loyalty_points`**: Programme fidélité
- **Table `reservations`**: Réservation de tables

---

## 🧪 Requêtes Courantes (Exemples)

### 1. Récupérer Menu avec Disponibilité
```sql
SELECT id, name, description, price, category, image_url, available, preparation_time
FROM products
WHERE available = true
ORDER BY category, name;
```

### 2. Créer Commande
```sql
BEGIN;

-- Créer l'order
INSERT INTO orders (order_number, user_id, order_type, subtotal, tax, total)
VALUES (generate_order_number(), 'user-uuid', 'takeaway', 10.00, 2.00, 12.00)
RETURNING id;

-- Ajouter les items
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
VALUES
  ('order-uuid', 'product-uuid-1', 2, 2.50, 5.00),
  ('product-uuid-2', 1, 5.00, 5.00);

COMMIT;
```

### 3. Historique Commandes Utilisateur
```sql
SELECT o.id, o.order_number, o.status, o.total, o.created_at,
       json_agg(json_build_object(
         'productName', p.name,
         'quantity', oi.quantity,
         'unitPrice', oi.unit_price
       )) AS items
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
JOIN products p ON p.id = oi.product_id
WHERE o.user_id = 'user-uuid'
GROUP BY o.id
ORDER BY o.created_at DESC
LIMIT 20;
```

---

**📅 Date de création**: 20 janvier 2026
**✍️ Auteur**: Backend Lead + Tech Lead
**🔄 Version**: 1.0
