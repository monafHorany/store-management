const Location = require("../models/location");
const asyncHandler = require("express-async-handler");
const Stand = require("../models/stands");
const Product = require("../models/products");
const Zone = require("../models/zone");

const insertProductInLocation = asyncHandler(async (req, res) => {
  const { quantity, zoneId, standId, productId } = req.body;
  let existingStand;
  try {
    existingStand = await Stand.findByPk(standId, { include: Product });
  } catch (err) {
    return res.status(500).json("can't find stand with the given Id");
  }
  let existingZone;
  try {
    existingZone = await Zone.findByPk(zoneId);
  } catch (err) {
    return res.status(500).json("can't find Zone with the given Id");
  }

  let existingProduct;

  try {
    existingProduct = await Product.findByPk(productId);
  } catch (err) {
    return res.status(500).json("can't find Product with the given Id");
  }

  if (existingStand && existingProduct) {
    await existingStand.addProduct(existingProduct, {
      through: { quantity: quantity, zone_label: existingZone.zone_label },
    });

    const result = await Stand.findOne({
      where: { id: standId },
      include: Product,
    });
    return res.status(200).json({
      messsage: `Added To Zone ${existingZone.zone_label} in Stand ${result.stand_label}`,
    });
  }
});
const editProducLocation = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  console.log(quantity);
  let location;
  try {
    location = await Location.findByPk(req.params.id);
  } catch (error) {
    throw new Error(error);
  }
  try {
    location.update({
      quantity: +quantity,
    });
  } catch (error) {
    throw new Error(error);
  }
  return res.status(201).json("quantity updated");
});

const deleteProductFromLocation = asyncHandler(async (req, res) => {
  const locationId = req.params.id;
  try {
    await Location.destroy({ where: { id: locationId } });
    res.status(202).json({ message: "Location Deleted" });
  } catch (error) {
    return res.status(500).json(error);
  }
});

exports.insertProductInLocation = insertProductInLocation;
exports.editProducLocation = editProducLocation;
exports.deleteProductFromLocation = deleteProductFromLocation;
