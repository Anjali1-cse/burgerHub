const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
return sequelize.define('OrderItemTopping', {
id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});
};