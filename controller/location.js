const Location = require("../models/location");
const asyncHandler = require("express-async-handler");
const Stand = require("../models/stands");
const Product = require("../models/products");

const insertProductInLocation = asyncHandler(async (req, res) => {
  const { quantity, zoneId, standId, productId } = req.body;
  let existingStand;
  try {
    existingStand = await Stand.findByPk(standId, { include: Product });
    res.json(existingStand);
  } catch (err) {
    return res.status(500).json("can't find stand with the given Id");
  }

  // let existingProduct;

  // try {
  //   existingProduct = await Product.findByPk(productId);
  // } catch (err) {
  //   res.status(500).json("can't find Product with the given Id");
  // }

  // if (existingStand && existingProduct) {
  //   await existingStand.addProduct(existingProduct, {
  //     through: { quantity: quantity, zoneId: zoneId },
  //   });

  //   const result = await Stand.findOne({
  //     where: { id: standId },
  //     include: Product,
  //   });
  //   res.status(200).json(result);
  // }
});

exports.insertProductInLocation = insertProductInLocation;
