const express = require('express');
const { CartItem, Order, OrderItem, Topping, Burger } = require('../models');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// 🧾 Checkout (Place Order)
router.post('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { customer, items, totalAmount } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ success: false, message: 'Cart is empty' });

    // 🧾 Create order
    const order = await Order.create({
      userId,
      paymentMethod: customer.paymentMethod,
      deliveryOption: customer.deliveryOption,
      address: customer.address,
      totalAmount,
    });

    // Fetch all user's cart items (with toppings)
    const cartItems = await CartItem.findAll({
      where: { userId },
      include: [
        { model: Topping, as: 'toppings', attributes: ['id', 'name', 'price'] },
      ],
    });

    // 🧩 Create order items (with toppingIds)
    await Promise.all(
      cartItems.map(async (cartItem) => {
        const toppingIds = cartItem.toppings.map((t) => t.id);
        return OrderItem.create({
          orderId: order.id,
          burgerId: cartItem.burgerId,
          toppingIds, // ✅ now saved
          quantity: cartItem.quantity,
          price: cartItem.totalPrice,
        });
      })
    );

    // 🧹 Clear cart
    await CartItem.destroy({ where: { userId } });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order,
    });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ success: false, message: 'Checkout failed', error: err.message });
  }
});

module.exports = router;
