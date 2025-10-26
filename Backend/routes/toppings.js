const express = require('express');
const router = express.Router();
const { Topping, Burger } = require('../models');

// GET all toppings with associated burgers
router.get('/', async (req, res) => {
  try {
    const toppings = await Topping.findAll({
      include: [
        {
          model: Burger,
          as: 'burgers',
          through: { attributes: [] },
        },
      ],
    });
    res.json(toppings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to fetch toppings' });
  }
});

// GET toppings for a specific burger
router.get('/:burgerId', async (req, res) => {
  const { burgerId } = req.params;
  try {
    const burger = await Burger.findByPk(burgerId, {
      include: [
        {
          model: Topping,
          as: 'toppings',
          through: { attributes: [] },
        },
      ],
    });

    if (!burger) return res.status(404).json({ msg: 'Burger not found' });

    res.json({
      id: burger.id,
      name: burger.name,
      price: burger.price,
      toppings: burger.toppings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
