const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { CartItem } = require('../models');

// Add to cart
router.post('/', authenticate, async (req, res) => {
  try {
    const { burgerId, toppingIds, quantity, totalPrice, action } = req.body;

    const newItem = await CartItem.create({
      userId: req.user.id,
      burgerId,
      toppingIds,
      quantity,
      totalPrice,
    });

    if (action === 'add_more') {
      return res.status(201).json({
        msg: 'Burger added! You can continue adding more items.',
        item: newItem,
        nextAction: 'continue',
      });
    }

    if (action === 'checkout') {
      return res.status(201).json({
        msg: 'Burger added! Ready to checkout?',
        item: newItem,
        nextAction: 'go_to_cart',
      });
    }

    res.status(201).json({ msg: 'Burger added to cart.', item: newItem });
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ msg: 'Failed to add item to cart' });
  }
});

module.exports = router;
