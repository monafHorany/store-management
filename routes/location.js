const express = require("express");
const router = express.Router();
const locationController = require("../controller/location");

router.post("/insertProduct", locationController.insertProductInLocation);

module.exports = router;
