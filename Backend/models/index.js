const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
  }
);

// Import models
const User = require('./user')(sequelize, DataTypes);
const Burger = require('./burger')(sequelize, DataTypes);
const Topping = require('./topping')(sequelize, DataTypes);
const CartItem = require('./cartItem')(sequelize, DataTypes);
// Run model associations
Object.values(sequelize.models).forEach((model) => {
  if (model.associate) model.associate(sequelize.models);
});

module.exports = { sequelize, User, Burger, Topping, CartItem };
