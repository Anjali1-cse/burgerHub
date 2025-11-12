const express = require("express");
const { Order, OrderItem, Burger, Topping } = require("../models");
const { authenticate } = require("../middleware/auth");
const router = express.Router();

router.get("/me", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [{ model: Burger, as: "burger" }],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // 🧠 Add topping names for each OrderItem
    for (const order of orders) {
      for (const item of order.items) {
        if (item.toppingIds && item.toppingIds.length > 0) {
          const toppings = await Topping.findAll({
            where: { id: item.toppingIds },
            attributes: ["name"],
          });
          item.dataValues.toppings = toppings.map((t) => t.name);
        } else {
          item.dataValues.toppings = [];
        }
      }
    }

    res.json({ orders });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({
      message: "Failed to fetch orders",
      error: err.message,
    });
  }
});

module.exports = router;
