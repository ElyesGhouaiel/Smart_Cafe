const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const { body } = require('express-validator');

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Récupérer toutes les commandes
 *     tags: [Commandes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, preparing, ready, served, paid, cancelled]
 *         description: Filtrer par statut
 *       - in: query
 *         name: tableId
 *         schema:
 *           type: integer
 *         description: Filtrer par table
 *     responses:
 *       200:
 *         description: Liste des commandes
 */
router.get('/', authenticate, orderController.getAll);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Récupérer une commande par ID
 *     tags: [Commandes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails de la commande
 */
router.get('/:id', authenticate, orderController.getById);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Créer une nouvelle commande
 *     tags: [Commandes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tableId
 *               - items
 *             properties:
 *               tableId:
 *                 type: integer
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *                     specialInstructions:
 *                       type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Commande créée
 */
router.post('/', [
  authenticate,
  body('tableId').isInt().withMessage('Table requise'),
  body('items').isArray({ min: 1 }).withMessage('Au moins un article requis')
], orderController.create);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Mettre à jour le statut d'une commande
 *     tags: [Commandes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, preparing, ready, served, paid, cancelled]
 *     responses:
 *       200:
 *         description: Statut mis à jour
 */
router.patch('/:id/status', authenticate, authorize('admin', 'manager', 'waiter'), orderController.updateStatus);

/**
 * @swagger
 * /api/orders/{id}/items:
 *   post:
 *     summary: Ajouter des articles à une commande
 *     tags: [Commandes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Articles ajoutés
 */
router.post('/:id/items', authenticate, orderController.addItems);

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   post:
 *     summary: Annuler une commande
 *     tags: [Commandes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Commande annulée
 */
router.post('/:id/cancel', authenticate, authorize('admin', 'manager', 'waiter'), orderController.cancel);

module.exports = router;
