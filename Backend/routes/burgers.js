const express = require('express');
const router = express.Router();
const { Burger, Topping } = require('../models');

// GET all burgers with toppings
router.get('/', async (req, res) => {
  try {
    const burgers = await Burger.findAll({
      include: [
        {
          model: Topping,
          as: 'toppings',
          through: { attributes: [] },
        },
      ],
    });
    res.json(burgers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to fetch burgers' });
  }
});

// GET single burger with toppings
router.get('/:id', async (req, res) => {
  try {
    const burger = await Burger.findByPk(req.params.id, {
      include: [
        {
          model: Topping,
          as: 'toppings',
          through: { attributes: [] },
        },
      ],
    });
    if (!burger) return res.status(404).json({ msg: 'Burger not found' });
    res.json(burger);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to fetch burger' });
  }
});

module.exports = router;
