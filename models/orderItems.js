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
    allowNull: true,
  },
  item_price: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  item_quantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  total: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  is_bundled_item: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = OrderItem;
