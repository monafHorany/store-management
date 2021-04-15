const { DataTypes } = require("sequelize");
const sequelize = require("../utils/databaseConnection");

const Location = sequelize.define("location", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  zoneId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Location;
