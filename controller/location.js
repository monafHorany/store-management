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
    res.status(500).json("can't find Product with the given Id");
  }

  if (existingStand && existingProduct) {
    await existingStand.addProduct(existingProduct, {
      through: { quantity: quantity, zone_Symbol: existingZone.zone_symbol },
    });

    const result = await Stand.findOne({
      where: { id: standId },
      include: Product,
    });
    return res
      .status(200)
      .json({
        messsage: `Added To Zone ${existingZone.zone_symbol} in Stand ${result.stand_number}`,
      });
  }
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
exports.deleteProductFromLocation = deleteProductFromLocation;
