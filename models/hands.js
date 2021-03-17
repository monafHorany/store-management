const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/databaseConnection");

const Hand = sequelize.define("hand", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  hand_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  hand_capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Hand;
