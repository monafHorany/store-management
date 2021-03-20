const asyncHandler = require("express-async-handler");
const { Op } = require("sequelize");
const Stand = require("../models/stands");

const fetchAllStandsByZoneId = asyncHandler(async (req, res, next) => {
  let existingStands;
  try {
    existingStands = await Stand.findAll({ where: { zoneId: req.params.id } });
  } catch (err) {
    res.status(500);
    throw new Error(err);
  }
  if (existingStands.length == 0) {
    return;
  }
  return res.status(200).json(existingStands);
});

const createNewStand = asyncHandler(async (req, res, next) => {
  const { stand_number, stand_capacity } = req.body;
  let existingstand;
  try {
    existingstand = await Stand.findOne({
      where: {
        [Op.and]: [{ stand_number: stand_number }, { zoneId: req.params.id }],
      },
    });
  } catch (err) {
    res.status(500);
    // throw new Error("creating Stand failed, please try again later.");
    throw new Error(err);
  }

  if (existingstand) {
    res.status(422);
    throw new Error("Stand exists already");
  }
  let createdStand;
  try {
    createdStand = await Stand.create({
      stand_number,
      stand_capacity,
      zoneId: req.params.id,
    });
  } catch (err) {
    res.status(500);
    throw new Error("creating Stand failed, please try again later.");
  }
  return res.status(201).json(createdStand);
});

const updateStand = asyncHandler(async (req, res, next) => {
  const StandId = req.params.id;
  let existedStand;
  try {
    existedStand = await Hand.findByPk(StandId);
    if (!existedStand) {
      res.status(404);
      throw new Error("no product with the given id");
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
  const { stand_number, stand_capacity } = req.body;

  let updatedStand;
  try {
    updatedStand = await existedStand.update({
      stand_number: stand_number || existedStand.stand_number,
      stand_capacity: stand_capacity || existedStand.stand_capacity,
    });
  } catch (err) {
    res.status(500);
    throw new Error(err);
  }
  return res.status(201).json(updatedStand);
});

const deleteStand = asyncHandler(async (req, res, next) => {
  const StandId = req.params.id;
  try {
    await Stand.destroy({
      where: {
        id: StandId,
      },
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }

  return res.status(201).json({ message: "hand deleted successfully" });
});

exports.fetchAllStandsByZoneId = fetchAllStandsByZoneId;
exports.createNewStand = createNewStand;
exports.updateStand = updateStand;
exports.deleteStand = deleteStand;
