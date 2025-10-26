const express = require('express');
const router = express.Router();
const { authenticate, isAdmin } = require('../middleware/auth');
const { User } = require('../models');

// Admin-only: get all users
router.get('/users', authenticate, isAdmin, async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'name', 'email', 'isAdmin'] });
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;
