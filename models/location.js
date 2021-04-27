const { DataTypes } = require("sequelize");
const sequelize = require("../utils/databaseConnection");
const Location = sequelize.define("location", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  zoneId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Location;
