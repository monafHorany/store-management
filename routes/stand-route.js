const express = require("express");
const router = express.Router();
const standController = require("../controller/stand");

router.get("/", standController.fetchAllStands);
router.get("/:id", standController.fetchAllStandsByZoneId);
router.post("/:id/create", standController.createNewStand);
router.post("/update/:id", standController.updateStand);
router.post("/delete/:id", standController.deleteStand);

module.exports = router;
