const { dbAsync } = require('../config/database');
const { validationResult } = require('express-validator');

/**
 * Générer un numéro de commande unique
 */
const generateOrderNumber = () => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `SC-${dateStr}-${random}`;
};

/**
 * Récupérer toutes les commandes
 */
exports.getAll = async (req, res, next) => {
  try {
    const { status, tableId } = req.query;
    
    let query = `
      SELECT o.*, t.table_number, 
             u.first_name || ' ' || u.last_name as user_name
      FROM orders o 
      LEFT JOIN tables t ON o.table_id = t.id
      LEFT JOIN users u ON o.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND o.status = ?';
      params.push(status);
    }

    if (tableId) {
      query += ' AND o.table_id = ?';
      params.push(tableId);
    }

    // Les clients ne voient que leurs commandes
    if (req.user.roleName === 'customer') {
      query += ' AND o.user_id = ?';
      params.push(req.user.id);
    }

    query += ' ORDER BY o.created_at DESC';

    const orders = await dbAsync.all(query, params);

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer une commande par ID avec ses articles
 */
exports.getById = async (req, res, next) => {
  try {
    const order = await dbAsync.get(`
      SELECT o.*, t.table_number, 
             u.first_name || ' ' || u.last_name as user_name
      FROM orders o 
      LEFT JOIN tables t ON o.table_id = t.id
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `, [req.params.id]);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Commande non trouvée'
      });
    }

    // Récupérer les articles de la commande
    const items = await dbAsync.all(`
      SELECT oi.*, p.name as product_name, p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [req.params.id]);

    res.json({
      success: true,
      data: {
        ...order,
        items
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Créer une nouvelle commande
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

    const { tableId, items, notes } = req.body;
    const orderNumber = generateOrderNumber();

    // Vérifier que la table existe
    const table = await dbAsync.get('SELECT id FROM tables WHERE id = ?', [tableId]);
    if (!table) {
      return res.status(404).json({
        success: false,
        error: 'Table non trouvée'
      });
    }

    // Créer la commande
    const orderResult = await dbAsync.run(`
      INSERT INTO orders (order_number, table_id, user_id, notes, status)
      VALUES (?, ?, ?, ?, 'pending')
    `, [orderNumber, tableId, req.user.id, notes || null]);

    const orderId = orderResult.lastID;
    let totalAmount = 0;

    // Ajouter les articles
    for (const item of items) {
      const product = await dbAsync.get('SELECT price FROM products WHERE id = ?', [item.productId]);
      
      if (!product) {
        continue;
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      await dbAsync.run(`
        INSERT INTO order_items (order_id, product_id, quantity, unit_price, special_instructions)
        VALUES (?, ?, ?, ?, ?)
      `, [orderId, item.productId, item.quantity, product.price, item.specialInstructions || null]);
    }

    // Mettre à jour le total de la commande
    await dbAsync.run('UPDATE orders SET total_amount = ? WHERE id = ?', [totalAmount, orderId]);

    // Mettre la table en statut "occupied"
    await dbAsync.run('UPDATE tables SET status = ? WHERE id = ?', ['occupied', tableId]);

    // Récupérer la commande complète
    const newOrder = await dbAsync.get('SELECT * FROM orders WHERE id = ?', [orderId]);
    const orderItems = await dbAsync.all(`
      SELECT oi.*, p.name as product_name
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [orderId]);

    res.status(201).json({
      success: true,
      message: 'Commande créée',
      data: {
        ...newOrder,
        items: orderItems
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre à jour le statut d'une commande
 */
exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'served', 'paid', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Statut invalide'
      });
    }

    await dbAsync.run(
      'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );

    // Si la commande est payée ou annulée, libérer la table
    if (status === 'paid' || status === 'cancelled') {
      const order = await dbAsync.get('SELECT table_id FROM orders WHERE id = ?', [id]);
      if (order) {
        await dbAsync.run('UPDATE tables SET status = ? WHERE id = ?', ['available', order.table_id]);
      }
    }

    res.json({
      success: true,
      message: 'Statut de la commande mis à jour'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Ajouter des articles à une commande existante
 */
exports.addItems = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { items } = req.body;

    const order = await dbAsync.get('SELECT * FROM orders WHERE id = ?', [id]);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Commande non trouvée'
      });
    }

    if (['paid', 'cancelled'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        error: 'Impossible de modifier une commande payée ou annulée'
      });
    }

    let additionalAmount = 0;

    for (const item of items) {
      const product = await dbAsync.get('SELECT price FROM products WHERE id = ?', [item.productId]);
      
      if (!product) continue;

      const itemTotal = product.price * item.quantity;
      additionalAmount += itemTotal;

      await dbAsync.run(`
        INSERT INTO order_items (order_id, product_id, quantity, unit_price, special_instructions)
        VALUES (?, ?, ?, ?, ?)
      `, [id, item.productId, item.quantity, product.price, item.specialInstructions || null]);
    }

    // Mettre à jour le total
    await dbAsync.run(
      'UPDATE orders SET total_amount = total_amount + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [additionalAmount, id]
    );

    res.json({
      success: true,
      message: 'Articles ajoutés à la commande'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Annuler une commande
 */
exports.cancel = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await dbAsync.get('SELECT * FROM orders WHERE id = ?', [id]);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Commande non trouvée'
      });
    }

    if (['paid', 'cancelled'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        error: 'Impossible d\'annuler cette commande'
      });
    }

    await dbAsync.run(
      'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['cancelled', id]
    );

    // Libérer la table
    await dbAsync.run('UPDATE tables SET status = ? WHERE id = ?', ['available', order.table_id]);

    res.json({
      success: true,
      message: 'Commande annulée'
    });
  } catch (error) {
    next(error);
  }
};
