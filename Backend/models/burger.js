module.exports = (sequelize, DataTypes) => {
  const Burger = sequelize.define('Burger', {
     id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: { 
      type: DataTypes.TEXT 
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
   image: { type: DataTypes.STRING }
  });

  Burger.associate = (models) => {
    Burger.belongsToMany(models.Topping, {
      through: 'BurgerToppings',
      as: 'toppings', // 👈 use lowercase for consistency
      foreignKey: 'burgerId',
      otherKey: 'toppingId',
    });
  };

  return Burger;
};
