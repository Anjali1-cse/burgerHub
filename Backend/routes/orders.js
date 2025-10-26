// routes/orders.js
const express = require('express');
const router = express.Router();
const { Order, OrderItem, OrderItemTopping } = require('../models');

router.post('/', async (req, res) => {
  // Expect body: { userId, items: [{ burgerId, qty, toppings: [toppingId] }] }
  const { userId, items } = req.body;

  try {
    // 1. Create order
    const order = await Order.create({ userId, totalPrice: 0 });

    let totalPrice = 0;

    // 2. Create order items
    for (const item of items) {
      const itemTotal = item.pricePerItem * item.qty;

      const orderItem = await OrderItem.create({
        orderId: order.id,
        burgerId: item.burgerId,
        qty: item.qty,
        pricePerItem: item.pricePerItem,
        total: itemTotal,
      });

      totalPrice += itemTotal;

      // 3. Add selected toppings for this item
      for (const toppingId of item.toppings) {
        await OrderItemTopping.create({
          orderItemId: orderItem.id,
          toppingId,
        });
      }
    }

    // 4. Update order total
    order.totalPrice = totalPrice;
    await order.save();

    res.json({ msg: 'Order placed', orderId: order.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to place order' });
  }
});

module.exports = router;
