const asyncHandler = require("express-async-handler");
const Product = require("../models/products");
const Stand = require("../models/stands");
const Zone = require("../models/zone");

const fetchAllZones = asyncHandler(async (req, res, next) => {
  let existingZones;
  try {
    existingZones = await Zone.findAll({
      include: { model: Stand, include: Product },
    });
  } catch (err) {
    res.status(500);
    throw new Error(err);
  }
  if (existingZones.length === 0) {
    return res.status(200).json([]);
  }
  return res.status(200).json(existingZones);
});

const fetchSingleZone = asyncHandler(async (req, res, next) => {
  let existingZone;
  try {
    existingZone = await Zone.findByPk(req.params.id, {
      include: { model: Stand, include: { model: Product } },
    });
  } catch (err) {
    return res.status(500).json(err.parent.sqlMessage);
  }
  if (!existingZone) {
    return res.status(404).json("no zone found with given id");
  }
  return res.status(200).json(existingZone);
});

const createNewZone = asyncHandler(async (req, res, next) => {
  const { zone_symbol, zone_capacity } = req.body;
  let existingZone;
  try {
    existingZone = await Zone.findOne({
      where: { zone_symbol: zone_symbol },
    });
  } catch (err) {
    res.status(500).json("creating Zone failed, please try again later.");
  }

  if (existingZone) {
    res.status(422).json("Zone exists already");
  }
  let createdZone;
  try {
    createdZone = await Zone.create({
      zone_symbol,
      zone_capacity,
    });
  } catch (err) {
    res.status(500).json("creating Zone failed, please try again later.");
  }
  return res.status(201).json(createdZone);
});

const updateZone = asyncHandler(async (req, res, next) => {
  const ZoneId = req.params.id;
  let existedZone;
  try {
    existedZone = await Zone.findByPk(ZoneId);
    if (!existedZone) {
      res.status(404).json("no Zone with the given id");
    }
  } catch (error) {
    res.status(500).json(error);
  }
  const { zone_symbol, zone_capacity } = req.body;

  let updatedZone;
  try {
    updatedZone = await existedZone.update({
      zone_symbol: zone_symbol || existedZone.zone_symbol,
      zone_capacity: zone_capacity || existedZone.zone_capacity,
    });
  } catch (err) {
    res.status(500).json(err);
  }
  return res.status(202).json(updatedZone);
});

const deleteZone = asyncHandler(async (req, res, next) => {
  const ZoneId = req.params.id;
  try {
    await Zone.destroy({
      where: {
        id: ZoneId,
      },
    });
  } catch (error) {
    res.status(500).json(error);
  }

  return res.status(201).json({ message: "Zone deleted successfully" });
});

exports.fetchAllZones = fetchAllZones;
exports.fetchSingleZone = fetchSingleZone;
exports.createNewZone = createNewZone;
exports.updateZone = updateZone;
exports.deleteZone = deleteZone;
