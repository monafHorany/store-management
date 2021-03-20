const express = require("express");
const router = express.Router();
const handController = require("../controller/stand");

router.get("/:id", handController.fetchAllStandsByZoneId);
router.post("/:id/create", handController.createNewStand);
router.post("/update/:id", handController.updateStand);
router.post("/delete/:id", handController.deleteStand);

module.exports = router;
