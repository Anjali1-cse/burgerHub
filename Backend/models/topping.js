module.exports = (sequelize, DataTypes) => {
  const Topping = sequelize.define('Topping', {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  });

  Topping.associate = (models) => {
    Topping.belongsToMany(models.Burger, {
      through: 'BurgerToppings',
      as: 'burgers',
      foreignKey: 'toppingId',
      otherKey: 'burgerId',
    });
  };

  return Topping;
};
