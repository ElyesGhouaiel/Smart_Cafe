const jwt = require('jsonwebtoken');
const { dbAsync } = require('../config/database');
require('dotenv').config();

/**
 * Middleware d'authentification JWT
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Token d\'authentification requis'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Récupérer l'utilisateur depuis la base de données
    const user = await dbAsync.get(
      'SELECT u.*, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ? AND u.is_active = 1',
      [decoded.userId]
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Utilisateur non trouvé ou inactif'
      });
    }

    // Ajouter l'utilisateur à la requête
    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      roleId: user.role_id,
      roleName: user.role_name
    };

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware de vérification des rôles
 * @param  {...string} roles - Rôles autorisés
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentification requise'
      });
    }

    if (!roles.includes(req.user.roleName)) {
      return res.status(403).json({
        success: false,
        error: 'Accès non autorisé pour ce rôle'
      });
    }

    next();
  };
};

module.exports = { authenticate, authorize };
