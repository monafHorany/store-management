const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/databaseConnection");

const Stand = sequelize.define("stand", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  stand_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  stand_capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Stand;
