const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/databaseConnection");

const Zone = sequelize.define("zone", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  zone_label: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  zone_capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Zone;
