const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const dbPath = process.env.DB_PATH || path.join(__dirname, 'smart_cafe.db');
const db = new sqlite3.Database(dbPath);

console.log('🔧 Initialisation de la base de données Smart Café...\n');

db.serialize(() => {
  // Table des rôles
  db.run(`
    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(50) UNIQUE NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Table des utilisateurs
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      phone VARCHAR(20),
      role_id INTEGER DEFAULT 3,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (role_id) REFERENCES roles(id)
    )
  `);

  // Table des catégories
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      image_url VARCHAR(500),
      display_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Table des produits
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(200) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      image_url VARCHAR(500),
      category_id INTEGER,
      is_available BOOLEAN DEFAULT 1,
      preparation_time INTEGER DEFAULT 10,
      allergens TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
  `);

  // Table des tables du restaurant
  db.run(`
    CREATE TABLE IF NOT EXISTS tables (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      table_number INTEGER UNIQUE NOT NULL,
      capacity INTEGER NOT NULL,
      status VARCHAR(20) DEFAULT 'available',
      location VARCHAR(100),
      qr_code VARCHAR(500),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Table des commandes
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number VARCHAR(50) UNIQUE NOT NULL,
      table_id INTEGER,
      user_id INTEGER,
      status VARCHAR(30) DEFAULT 'pending',
      total_amount DECIMAL(10, 2) DEFAULT 0,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (table_id) REFERENCES tables(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Table des items de commande
  db.run(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      unit_price DECIMAL(10, 2) NOT NULL,
      special_instructions TEXT,
      status VARCHAR(30) DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  // Table des paiements
  db.run(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      payment_method VARCHAR(50) NOT NULL,
      status VARCHAR(30) DEFAULT 'pending',
      transaction_id VARCHAR(100),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id)
    )
  `);

  // Insertion des rôles par défaut
  db.run(`INSERT OR IGNORE INTO roles (id, name, description) VALUES (1, 'admin', 'Administrateur du système')`);
  db.run(`INSERT OR IGNORE INTO roles (id, name, description) VALUES (2, 'manager', 'Gérant du café')`);
  db.run(`INSERT OR IGNORE INTO roles (id, name, description) VALUES (3, 'waiter', 'Serveur')`);
  db.run(`INSERT OR IGNORE INTO roles (id, name, description) VALUES (4, 'customer', 'Client')`);

  // Insertion des catégories par défaut
  db.run(`INSERT OR IGNORE INTO categories (id, name, description, display_order) VALUES (1, 'Boissons Chaudes', 'Cafés, thés et chocolats', 1)`);
  db.run(`INSERT OR IGNORE INTO categories (id, name, description, display_order) VALUES (2, 'Boissons Froides', 'Jus, smoothies et sodas', 2)`);
  db.run(`INSERT OR IGNORE INTO categories (id, name, description, display_order) VALUES (3, 'Pâtisseries', 'Viennoiseries et desserts', 3)`);
  db.run(`INSERT OR IGNORE INTO categories (id, name, description, display_order) VALUES (4, 'Salé', 'Sandwichs et plats salés', 4)`);

  // Insertion de produits d'exemple
  db.run(`INSERT OR IGNORE INTO products (id, name, description, price, category_id, preparation_time) VALUES (1, 'Espresso', 'Café espresso intense', 3.50, 1, 3)`);
  db.run(`INSERT OR IGNORE INTO products (id, name, description, price, category_id, preparation_time) VALUES (2, 'Cappuccino', 'Espresso avec mousse de lait', 4.50, 1, 5)`);
  db.run(`INSERT OR IGNORE INTO products (id, name, description, price, category_id, preparation_time) VALUES (3, 'Latte', 'Café au lait onctueux', 5.00, 1, 5)`);
  db.run(`INSERT OR IGNORE INTO products (id, name, description, price, category_id, preparation_time) VALUES (4, 'Thé Earl Grey', 'Thé noir parfumé à la bergamote', 4.00, 1, 4)`);
  db.run(`INSERT OR IGNORE INTO products (id, name, description, price, category_id, preparation_time) VALUES (5, 'Chocolat Chaud', 'Chocolat belge onctueux', 5.50, 1, 5)`);
  db.run(`INSERT OR IGNORE INTO products (id, name, description, price, category_id, preparation_time) VALUES (6, 'Jus d''Orange Pressé', 'Oranges fraîchement pressées', 6.00, 2, 5)`);
  db.run(`INSERT OR IGNORE INTO products (id, name, description, price, category_id, preparation_time) VALUES (7, 'Smoothie Fruits Rouges', 'Fraises, framboises, myrtilles', 7.50, 2, 7)`);
  db.run(`INSERT OR IGNORE INTO products (id, name, description, price, category_id, preparation_time) VALUES (8, 'Croissant', 'Croissant pur beurre', 3.00, 3, 2)`);
  db.run(`INSERT OR IGNORE INTO products (id, name, description, price, category_id, preparation_time) VALUES (9, 'Pain au Chocolat', 'Viennoiserie au chocolat', 3.50, 3, 2)`);
  db.run(`INSERT OR IGNORE INTO products (id, name, description, price, category_id, preparation_time) VALUES (10, 'Club Sandwich', 'Poulet, bacon, salade, tomate', 12.00, 4, 15)`);

  // Insertion de tables
  for (let i = 1; i <= 10; i++) {
    db.run(`INSERT OR IGNORE INTO tables (id, table_number, capacity, location) VALUES (${i}, ${i}, ${i <= 4 ? 2 : 4}, '${i <= 5 ? 'Terrasse' : 'Intérieur'}')`);
  }

  // Création d'un admin par défaut
  const adminPassword = bcrypt.hashSync('admin123', 10);
  db.run(`INSERT OR IGNORE INTO users (id, email, password, first_name, last_name, role_id) VALUES (1, 'admin@smartcafe.fr', '${adminPassword}', 'Admin', 'SmartCafé', 1)`);

  console.log('✅ Tables créées avec succès');
  console.log('✅ Données de démonstration insérées');
  console.log('\n📧 Compte admin: admin@smartcafe.fr / admin123\n');
});

db.close((err) => {
  if (err) {
    console.error('❌ Erreur lors de la fermeture:', err.message);
  } else {
    console.log('✅ Base de données initialisée avec succès!');
  }
});
