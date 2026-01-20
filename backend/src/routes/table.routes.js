const express = require('express');
const router = express.Router();
const tableController = require('../controllers/table.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const { body } = require('express-validator');

/**
 * @swagger
 * /api/tables:
 *   get:
 *     summary: Récupérer toutes les tables
 *     tags: [Tables]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [available, occupied, reserved]
 *         description: Filtrer par statut
 *     responses:
 *       200:
 *         description: Liste des tables
 */
router.get('/', tableController.getAll);

/**
 * @swagger
 * /api/tables/{id}:
 *   get:
 *     summary: Récupérer une table par ID
 *     tags: [Tables]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails de la table
 */
router.get('/:id', tableController.getById);

/**
 * @swagger
 * /api/tables:
 *   post:
 *     summary: Créer une nouvelle table
 *     tags: [Tables]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tableNumber
 *               - capacity
 *             properties:
 *               tableNumber:
 *                 type: integer
 *               capacity:
 *                 type: integer
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: Table créée
 */
router.post('/', [
  authenticate,
  authorize('admin', 'manager'),
  body('tableNumber').isInt({ min: 1 }).withMessage('Numéro de table invalide'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacité invalide')
], tableController.create);

/**
 * @swagger
 * /api/tables/{id}:
 *   put:
 *     summary: Mettre à jour une table
 *     tags: [Tables]
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
 *         description: Table mise à jour
 */
router.put('/:id', authenticate, authorize('admin', 'manager'), tableController.update);

/**
 * @swagger
 * /api/tables/{id}/status:
 *   patch:
 *     summary: Changer le statut d'une table
 *     tags: [Tables]
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
 *                 enum: [available, occupied, reserved]
 *     responses:
 *       200:
 *         description: Statut mis à jour
 */
router.patch('/:id/status', authenticate, authorize('admin', 'manager', 'waiter'), tableController.updateStatus);

/**
 * @swagger
 * /api/tables/{id}:
 *   delete:
 *     summary: Supprimer une table
 *     tags: [Tables]
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
 *         description: Table supprimée
 */
router.delete('/:id', authenticate, authorize('admin', 'manager'), tableController.delete);

module.exports = router;
