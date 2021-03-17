const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/databaseConnection");

const User = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      min: 6,
    },
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = User;
