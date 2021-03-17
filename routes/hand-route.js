const express = require("express");
const router = express.Router();
const handController = require("../controller/hand");

router.get("/:id", handController.fetchAllHandsByZoneId);
router.post("/:id/create", handController.createNewHand);
router.post("/update/:id", handController.updateHand);
router.post("/delete/:id", handController.deleteHand);

module.exports = router;
