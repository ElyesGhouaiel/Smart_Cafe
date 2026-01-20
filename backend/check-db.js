const { dbAsync } = require('./src/config/database');

async function checkDB() {
  try {
    // Lister les tables
    const tables = await dbAsync.all("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('\n📊 TABLES CRÉÉES:');
    console.log(tables.map(t => '  - ' + t.name).join('\n'));

    // Compter les enregistrements
    console.log('\n📈 DONNÉES:');
    const roles = await dbAsync.all('SELECT * FROM roles');
    console.log(`  - Rôles: ${roles.length}`);
    
    const users = await dbAsync.all('SELECT * FROM users');
    console.log(`  - Utilisateurs: ${users.length}`);
    
    const categories = await dbAsync.all('SELECT * FROM categories');
    console.log(`  - Catégories: ${categories.length}`);
    
    const products = await dbAsync.all('SELECT * FROM products');
    console.log(`  - Produits: ${products.length}`);
    
    const tables_resto = await dbAsync.all('SELECT * FROM tables');
    console.log(`  - Tables restaurant: ${tables_resto.length}`);

    console.log('\n✅ Base de données opérationnelle!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

checkDB();
