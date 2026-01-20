const bcrypt = require('bcryptjs');
const { dbAsync } = require('../config/database');

/**
 * Récupérer tous les utilisateurs
 */
exports.getAll = async (req, res, next) => {
  try {
    const users = await dbAsync.all(`
      SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.is_active, u.created_at, r.name as role
      FROM users u 
      JOIN roles r ON u.role_id = r.id
      ORDER BY u.created_at DESC
    `);

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer le profil de l'utilisateur connecté
 */
exports.getProfile = async (req, res, next) => {
  try {
    const user = await dbAsync.get(`
      SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.created_at, r.name as role
      FROM users u 
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
    `, [req.user.id]);

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer un utilisateur par ID
 */
exports.getById = async (req, res, next) => {
  try {
    const user = await dbAsync.get(`
      SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.is_active, u.created_at, r.name as role
      FROM users u 
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
    `, [req.params.id]);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre à jour un utilisateur
 */
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phone, password, roleId } = req.body;

    // Vérifier les droits (seul l'admin peut modifier le rôle, l'utilisateur peut modifier son profil)
    if (req.user.id !== parseInt(id) && req.user.roleName !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Non autorisé à modifier cet utilisateur'
      });
    }

    let query = 'UPDATE users SET first_name = ?, last_name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP';
    let params = [firstName, lastName, phone];

    // Si un nouveau mot de passe est fourni
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ', password = ?';
      params.push(hashedPassword);
    }

    // Seul l'admin peut changer le rôle
    if (roleId && req.user.roleName === 'admin') {
      query += ', role_id = ?';
      params.push(roleId);
    }

    query += ' WHERE id = ?';
    params.push(id);

    await dbAsync.run(query, params);

    res.json({
      success: true,
      message: 'Utilisateur mis à jour'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer un utilisateur (désactivation)
 */
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    await dbAsync.run('UPDATE users SET is_active = 0 WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Utilisateur désactivé'
    });
  } catch (error) {
    next(error);
  }
};
