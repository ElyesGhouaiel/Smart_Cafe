const { dbAsync } = require('../config/database');
const { validationResult } = require('express-validator');

/**
 * Récupérer toutes les catégories
 */
exports.getAll = async (req, res, next) => {
  try {
    const categories = await dbAsync.all(`
      SELECT * FROM categories 
      WHERE is_active = 1 
      ORDER BY display_order ASC
    `);

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer une catégorie par ID avec ses produits
 */
exports.getById = async (req, res, next) => {
  try {
    const category = await dbAsync.get('SELECT * FROM categories WHERE id = ?', [req.params.id]);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Catégorie non trouvée'
      });
    }

    // Récupérer les produits de cette catégorie
    const products = await dbAsync.all(
      'SELECT * FROM products WHERE category_id = ? AND is_available = 1',
      [req.params.id]
    );

    res.json({
      success: true,
      data: {
        ...category,
        products
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Créer une nouvelle catégorie
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

    const { name, description, imageUrl, displayOrder } = req.body;

    const result = await dbAsync.run(
      'INSERT INTO categories (name, description, image_url, display_order) VALUES (?, ?, ?, ?)',
      [name, description || null, imageUrl || null, displayOrder || 0]
    );

    const newCategory = await dbAsync.get('SELECT * FROM categories WHERE id = ?', [result.lastID]);

    res.status(201).json({
      success: true,
      message: 'Catégorie créée',
      data: newCategory
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre à jour une catégorie
 */
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, imageUrl, displayOrder, isActive } = req.body;

    await dbAsync.run(`
      UPDATE categories 
      SET name = ?, description = ?, image_url = ?, display_order = ?, is_active = ?
      WHERE id = ?
    `, [name, description, imageUrl, displayOrder, isActive ? 1 : 0, id]);

    const updatedCategory = await dbAsync.get('SELECT * FROM categories WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Catégorie mise à jour',
      data: updatedCategory
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer une catégorie (désactivation)
 */
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Vérifier s'il y a des produits associés
    const products = await dbAsync.get('SELECT COUNT(*) as count FROM products WHERE category_id = ?', [id]);
    
    if (products.count > 0) {
      // Désactiver plutôt que supprimer
      await dbAsync.run('UPDATE categories SET is_active = 0 WHERE id = ?', [id]);
      return res.json({
        success: true,
        message: 'Catégorie désactivée (contient des produits)'
      });
    }

    await dbAsync.run('DELETE FROM categories WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Catégorie supprimée'
    });
  } catch (error) {
    next(error);
  }
};
