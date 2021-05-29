const { DataTypes } = require("sequelize");
const sequelize = require("../utils/databaseConnection");

const OrderItem = sequelize.define("order_item", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  item_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  item_sku: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  item_price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  item_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
});

module.exports = OrderItem;
