const { DataTypes } = require("sequelize");
const sequelize = require("../utils/databaseConnection");

const Order = sequelize.define("order", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  order_owner_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  order_owner_email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  order_owner_phone_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  order_created_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  order_status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  billing_address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  shipping_address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  is_finished: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  total: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  payment_method: {
    type: DataTypes.STRING,
    allowNull: false,
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
