const asyncHandler = require("express-async-handler");
const { Op } = require("sequelize");
const Hand = require("../models/hands");

const fetchAllHandsByZoneId = asyncHandler(async (req, res, next) => {
  let existingHands;
  try {
    existingHands = await Hand.findAll({ where: { zoneId: req.params.id } });
  } catch (err) {
    res.status(500);
    throw new Error(err);
  }
  if (existingHands.length == 0) {
    return;
  }
  return res.status(200).json(existingHands);
});

const createNewHand = asyncHandler(async (req, res, next) => {
  const { hand_number, hand_capacity } = req.body;
  let existingHand;
  try {
    existingHand = await Hand.findOne({
      where: {
        [Op.and]: [{ hand_number: hand_number }, { zoneId: req.params.id }],
      },
    });
  } catch (err) {
    res.status(500);
    throw new Error("creating Hand failed, please try again later.");
  }

  if (existingHand) {
    res.status(422);
    throw new Error("Hand exists already");
  }
  let createdHand;
  try {
    createdHand = await Hand.create({
      hand_number,
      hand_capacity,
      zoneId: req.params.id
    });
  } catch (err) {
    res.status(500);
    throw new Error("creating Hnad failed, please try again later.");
  }
  return res.status(201).json(createdHand);
});

const updateHand = asyncHandler(async (req, res, next) => {
  const HandId = req.params.id;
  let existedHand;
  try {
    existedHand = await Hand.findByPk(HandId);
    if (!existedHand) {
      res.status(404);
      throw new Error("no product with the given id");
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
  const { hand_number, hand_capacity } = req.body;

  let updatedHand;
  try {
    updatedHand = await existedHand.update({
      hand_number: hand_number || existedHand.producthand_number_ar_name,
      hand_capacity: hand_capacity || existedHand.hand_capacity,
    });
  } catch (err) {
    res.status(500);
    throw new Error(err);
  }
  return res.status(201).json(updatedHand);
});

const deleteHand = asyncHandler(async (req, res, next) => {
  const HandId = req.params.id;
  try {
    await Hand.destroy({
      where: {
        id: HandId,
      },
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }

  return res.status(201).json({ message: "hand deleted successfully" });
});

exports.fetchAllHandsByZoneId = fetchAllHandsByZoneId;
exports.createNewHand = createNewHand;
exports.updateHand = updateHand;
exports.deleteHand = deleteHand;
