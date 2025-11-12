module.exports = (sequelize, DataTypes) => {
  return sequelize.define('OrderItem', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    orderId: { type: DataTypes.INTEGER, allowNull: false },
    burgerId: { type: DataTypes.INTEGER, allowNull: false },
    toppingIds: { type: DataTypes.JSON, allowNull: true },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
    price: { type: DataTypes.FLOAT, allowNull: false },
  });
};
