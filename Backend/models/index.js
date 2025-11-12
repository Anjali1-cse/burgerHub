const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = require('./user')(sequelize, DataTypes);
const Burger = require('./burger')(sequelize, DataTypes);
const Topping = require('./topping')(sequelize, DataTypes);
const CartItem = require('./cartItem')(sequelize, DataTypes);
const Order = require('./order')(sequelize, DataTypes);
const OrderItem = require('./orderItem')(sequelize, DataTypes);

// 🧩 Associations
User.hasMany(CartItem, { foreignKey: 'userId' });
CartItem.belongsTo(User, { foreignKey: 'userId' });

Burger.hasMany(CartItem, { foreignKey: 'burgerId' });
CartItem.belongsTo(Burger, { foreignKey: 'burgerId' });

// 🧀 Many-to-many between CartItem and Topping
CartItem.belongsToMany(Topping, { through: 'CartItemToppings', as: 'toppings' });
Topping.belongsToMany(CartItem, { through: 'CartItemToppings', as: 'cartItems' });

// 🧾 Orders
User.hasMany(Order, { foreignKey: "userId", as: "orders" });
Order.belongsTo(User, { foreignKey: "userId", as: "user" });

// ✅ Add alias 'items' for Order ↔ OrderItem relationship
Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });

// ✅ Add alias 'burger' for OrderItem ↔ Burger relationship
Burger.hasMany(OrderItem, { foreignKey: "burgerId", as: "orderItems" });
OrderItem.belongsTo(Burger, { foreignKey: "burgerId", as: "burger" });

module.exports = { sequelize, User, Burger, Topping, CartItem, Order, OrderItem };
