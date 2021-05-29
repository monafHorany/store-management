const { DataTypes } = require("sequelize");
const sequelize = require("../utils/databaseConnection");

const Order = sequelize.define("order", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  ordered_by: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_finished: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  woo_order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },    
});

module.exports = Order;
