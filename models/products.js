const { DataTypes } = require("sequelize");
const sequelize = require("../utils/databaseConnection");

const Product = sequelize.define("product", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  product_ar_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  product_en_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  product_en_desc: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
  product_ar_desc: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
  product_barcode: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
  product_sku: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    unique: true,
  }
});

module.exports = Product;
