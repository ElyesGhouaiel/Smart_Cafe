const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const { body } = require('express-validator');

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Récupérer tous les produits
 *     tags: [Produits]
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: Filtrer par catégorie
 *       - in: query
 *         name: available
 *         schema:
 *           type: boolean
 *         description: Filtrer par disponibilité
 *     responses:
 *       200:
 *         description: Liste des produits
 */
router.get('/', productController.getAll);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Récupérer un produit par ID
 *     tags: [Produits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails du produit
 */
router.get('/:id', productController.getById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Créer un nouveau produit
 *     tags: [Produits]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: integer
 *               preparationTime:
 *                 type: integer
 *               allergens:
 *                 type: string
 *     responses:
 *       201:
 *         description: Produit créé
 */
router.post('/', [
  authenticate,
  authorize('admin', 'manager'),
  body('name').notEmpty().withMessage('Le nom est requis'),
  body('price').isFloat({ min: 0 }).withMessage('Le prix doit être positif'),
  body('categoryId').isInt().withMessage('La catégorie est requise')
], productController.create);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Mettre à jour un produit
 *     tags: [Produits]
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
 *         description: Produit mis à jour
 */
router.put('/:id', authenticate, authorize('admin', 'manager'), productController.update);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Supprimer un produit
 *     tags: [Produits]
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
 *         description: Produit supprimé
 */
router.delete('/:id', authenticate, authorize('admin', 'manager'), productController.delete);

/**
 * @swagger
 * /api/products/{id}/availability:
 *   patch:
 *     summary: Changer la disponibilité d'un produit
 *     tags: [Produits]
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
 *         description: Disponibilité mise à jour
 */
router.patch('/:id/availability', authenticate, authorize('admin', 'manager', 'waiter'), productController.toggleAvailability);

module.exports = router;
