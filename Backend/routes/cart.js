const express = require("express");
const router = express.Router();
const { CartItem, Burger, Topping } = require("../models");
const { authenticate } = require("../middleware/auth");

// 🛒 Get logged-in user's cart
router.get("/me", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const items = await CartItem.findAll({
      where: { userId },
      include: [
        { model: Burger, attributes: ["id", "name", "price", "imageUrl"] },
        { model: Topping, as: "toppings", attributes: ["id", "name", "price"] },
      ],
    });

    res.json({ items });
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ➕ Add to cart
router.post("/add", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { burgerId, toppingIds = [], quantity, totalPrice } = req.body;

    if (!burgerId || !quantity || !totalPrice)
      return res.status(400).json({ msg: "Missing required fields" });

    const newItem = await CartItem.create({
      userId,
      burgerId,
      quantity,
      totalPrice,
    });

    if (toppingIds.length > 0) {
      await newItem.setToppings(toppingIds); // auto uses CartItemToppings table
    }

    res.status(201).json({ msg: "Added to cart successfully" });
  } catch (err) {
    console.error("Error adding cart:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// 🗑️ Remove from cart
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItem = await CartItem.findOne({
      where: { id: req.params.id, userId },
    });

    if (!cartItem) return res.status(404).json({ msg: "Item not found" });

    await cartItem.destroy();
    res.json({ msg: "Item removed from cart" });
  } catch (err) {
    console.error("Error removing item:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
