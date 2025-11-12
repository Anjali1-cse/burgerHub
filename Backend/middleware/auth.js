const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticate = async (req, res, next) => {
  // Accept both x-auth-token or Authorization: Bearer
  const token =
    req.header('x-auth-token') ||
    (req.header('Authorization')?.startsWith('Bearer ')
      ? req.header('Authorization').split(' ')[1]
      : null);

  if (!token) return res.status(401).json({ msg: 'No token, access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'name', 'email', 'isAdmin'],
    });

    if (!user) return res.status(401).json({ msg: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError')
      return res.status(401).json({ msg: 'Token expired' });
    return res.status(401).json({ msg: 'Invalid token' });
  }
};
const isAdmin = (req, res, next) => {
  if (!req.user?.isAdmin)
    return res.status(403).json({ msg: 'Access denied: Admin only' });
  next();
};

module.exports = { authenticate,isAdmin };
