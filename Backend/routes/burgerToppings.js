// routes/burgerToppings.js
const express = require('express');
const router = express.Router();
const { Burger, Topping } = require('../models');

// POST /api/burger-toppings
// Body: { burgerId: 1, toppingIds: [1,2,3] }
router.post('/', async (req, res) => {
  const { burgerId, toppingIds } = req.body;

  if (!burgerId || !Array.isArray(toppingIds)) {
    return res.status(400).json({ msg: 'burgerId and toppingIds are required' });
  }

  try {
    const burger = await Burger.findByPk(burgerId);
    if (!burger) return res.status(404).json({ msg: 'Burger not found' });

    await burger.setToppings(toppingIds); // replaces previous toppings with new ones

    res.json({ msg: 'Burger toppings updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to save burger toppings' });
  }
});

module.exports = router;
