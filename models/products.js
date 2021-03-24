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
  },

  product_en_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  product_ar_desc: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  product_en_desc: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  product_barcode: {
    type: DataTypes.STRING(500),
    allowNull: false,
    unique: true,
  },
  product_sku: {
    type: DataTypes.STRING(500),
    allowNull: false,
    unique: true,
  },
  model_number: {
    type: DataTypes.STRING(500),
    allowNull: false,
    unique: true,
  },
});

module.exports = Product;
