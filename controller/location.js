const Location = require('../models/location');
const asyncHandler = require("express-async-handler");



const createProductLocationWithQuantity = asyncHandler(async (req, res) => {
    const {quantity, zoneId, standId, productId} = req.body;
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

})



