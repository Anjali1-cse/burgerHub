// models/cartItem.js
module.exports = (sequelize, DataTypes) => {
  const CartItem = sequelize.define('CartItem', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    burgerId: { type: DataTypes.INTEGER, allowNull: false },
    toppingIds: { type: DataTypes.JSON },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
    totalPrice: { type: DataTypes.FLOAT, allowNull: false },
  });

  CartItem.associate = (models) => {
    CartItem.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
    CartItem.belongsTo(models.Burger, { foreignKey: 'burgerId', onDelete: 'CASCADE' });
  };

  return CartItem;
};
