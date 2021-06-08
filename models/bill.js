const { DataTypes } = require("sequelize");
const sequelize = require("../utils/databaseConnection");
const Bill = sequelize.define("bill", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  order_owner: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  order_total: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  woo_order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = Bill;
