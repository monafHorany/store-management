const { DataTypes } = require("sequelize");
const sequelize = require("../utils/databaseConnection");

const Product = sequelize.define("product", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  product_en_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  product_en_desc: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  product_barcode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  product_sku: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  model_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Product;
