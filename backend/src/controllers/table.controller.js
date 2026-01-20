const { dbAsync } = require('../config/database');
const { validationResult } = require('express-validator');

/**
 * Récupérer toutes les tables
 */
exports.getAll = async (req, res, next) => {
  try {
    const { status } = req.query;
    
    let query = 'SELECT * FROM tables WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY table_number';

    const tables = await dbAsync.all(query, params);

    res.json({
      success: true,
      data: tables
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer une table par ID avec commande active
 */
exports.getById = async (req, res, next) => {
  try {
    const table = await dbAsync.get('SELECT * FROM tables WHERE id = ?', [req.params.id]);

    if (!table) {
      return res.status(404).json({
        success: false,
        error: 'Table non trouvée'
      });
    }

    // Récupérer la commande active pour cette table
    const activeOrder = await dbAsync.get(`
      SELECT * FROM orders 
      WHERE table_id = ? AND status NOT IN ('paid', 'cancelled')
      ORDER BY created_at DESC LIMIT 1
    `, [req.params.id]);

    res.json({
      success: true,
      data: {
        ...table,
        activeOrder
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Créer une nouvelle table
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

    const { tableNumber, capacity, location } = req.body;

    // Vérifier si le numéro de table existe déjà
    const existing = await dbAsync.get('SELECT id FROM tables WHERE table_number = ?', [tableNumber]);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'Ce numéro de table existe déjà'
      });
    }

    const result = await dbAsync.run(
      'INSERT INTO tables (table_number, capacity, location) VALUES (?, ?, ?)',
      [tableNumber, capacity, location || null]
    );

    const newTable = await dbAsync.get('SELECT * FROM tables WHERE id = ?', [result.lastID]);

    res.status(201).json({
      success: true,
      message: 'Table créée',
      data: newTable
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre à jour une table
 */
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tableNumber, capacity, location, status } = req.body;

    await dbAsync.run(`
      UPDATE tables 
      SET table_number = ?, capacity = ?, location = ?, status = ?
      WHERE id = ?
    `, [tableNumber, capacity, location, status, id]);

    const updatedTable = await dbAsync.get('SELECT * FROM tables WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Table mise à jour',
      data: updatedTable
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre à jour le statut d'une table
 */
exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['available', 'occupied', 'reserved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Statut invalide'
      });
    }

    await dbAsync.run('UPDATE tables SET status = ? WHERE id = ?', [status, id]);

    res.json({
      success: true,
      message: 'Statut de la table mis à jour'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer une table
 */
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Vérifier s'il y a des commandes associées
    const orders = await dbAsync.get('SELECT COUNT(*) as count FROM orders WHERE table_id = ?', [id]);
    
    if (orders.count > 0) {
      return res.status(400).json({
        success: false,
        error: 'Impossible de supprimer une table avec des commandes associées'
      });
    }

    await dbAsync.run('DELETE FROM tables WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Table supprimée'
    });
  } catch (error) {
    next(error);
  }
};
