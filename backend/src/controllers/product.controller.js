const { dbAsync } = require('../config/database');
const { validationResult } = require('express-validator');

/**
 * Récupérer tous les produits
 */
exports.getAll = async (req, res, next) => {
  try {
    const { categoryId, available } = req.query;
    
    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE 1=1
    `;
    const params = [];

    if (categoryId) {
      query += ' AND p.category_id = ?';
      params.push(categoryId);
    }

    if (available !== undefined) {
      query += ' AND p.is_available = ?';
      params.push(available === 'true' ? 1 : 0);
    }

    query += ' ORDER BY c.display_order, p.name';

    const products = await dbAsync.all(query, params);

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer un produit par ID
 */
exports.getById = async (req, res, next) => {
  try {
    const product = await dbAsync.get(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = ?
    `, [req.params.id]);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Produit non trouvé'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Créer un nouveau produit
 */
exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, description, price, categoryId, preparationTime, allergens } = req.body;
    let imageUrl = req.body.imageUrl || null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const result = await dbAsync.run(`
      INSERT INTO products (name, description, price, image_url, category_id, preparation_time, allergens) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [name, description || null, price, imageUrl, categoryId, preparationTime || 10, allergens || null]);

    const newProduct = await dbAsync.get('SELECT * FROM products WHERE id = ?', [result.lastID]);

    res.status(201).json({
      success: true,
      message: 'Produit créé',
      data: newProduct
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre à jour un produit
 */
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, categoryId, preparationTime, allergens, isAvailable } = req.body;
    let imageUrl = req.body.imageUrl;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    await dbAsync.run(`
      UPDATE products 
      SET name = ?, description = ?, price = ?, image_url = ?, category_id = ?, 
          preparation_time = ?, allergens = ?, is_available = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [name, description, price, imageUrl, categoryId, preparationTime, allergens, isAvailable ? 1 : 0, id]);

    const updatedProduct = await dbAsync.get('SELECT * FROM products WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Produit mis à jour',
      data: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer un produit
 */
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Vérifier s'il y a des commandes associées
    const orders = await dbAsync.get('SELECT COUNT(*) as count FROM order_items WHERE product_id = ?', [id]);
    
    if (orders.count > 0) {
      // Désactiver plutôt que supprimer
      await dbAsync.run('UPDATE products SET is_available = 0 WHERE id = ?', [id]);
      return res.json({
        success: true,
        message: 'Produit désactivé (associé à des commandes)'
      });
    }

    await dbAsync.run('DELETE FROM products WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Produit supprimé'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Changer la disponibilité d'un produit
 */
exports.toggleAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isAvailable } = req.body;

    await dbAsync.run(
      'UPDATE products SET is_available = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [isAvailable ? 1 : 0, id]
    );

    res.json({
      success: true,
      message: `Produit ${isAvailable ? 'activé' : 'désactivé'}`
    });
  } catch (error) {
    next(error);
  }
};
