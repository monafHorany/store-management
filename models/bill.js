const { DataTypes } = require("sequelize");
const sequelize = require("../utils/databaseConnection");
const moment = require("moment");

const Bill = sequelize.define("bill", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  order_owner: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    get() {
      return moment(this.getDataValue("createdAt")).format(
        "DD/MM/YYYY h:mm:ss"
      );
    },
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
