const express = require('express');
const { Topping } = require('../models');
const router = express.Router();

router.get('/', async (req, res) => {
  const toppings = await Topping.findAll();
  res.json(toppings);
});

router.post('/', async (req, res) => {
  const topping = await Topping.create(req.body);
  res.status(201).json(topping);
});

module.exports = router;
