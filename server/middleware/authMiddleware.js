const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from header "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Verify JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'alumniconnect_super_secret_jwt_key_2026');

      // Get user from database without returning password field
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized, user not found' });
      }

      next();
    } catch (error) {
      console.error('Auth Middleware Error:', error.message);
      return res.status(401).json({ message: 'Unauthorized, invalid or expired token' });
    }
  } else {
    return res.status(401).json({ message: 'Unauthorized, no token provided' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
};

module.exports = { protect, admin };
