const express = require('express');
const { Burger } = require('../models');
const router = express.Router();

router.get('/', async (req, res) => {
  const burgers = await Burger.findAll();
  res.json(burgers);
});

router.post('/', async (req, res) => {
  const burger = await Burger.create(req.body);
  res.status(201).json(burger);
});

router.get('/:id', async (req, res) => {
  const burger = await Burger.findByPk(req.params.id);
  if (!burger) return res.status(404).json({ message: 'Burger not found' });
  res.json(burger);
});

module.exports = router;
