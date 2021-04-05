const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const zoneController = require("../controller/zone");

router.get("/", zoneController.fetchAllZones);
router.get("/:id", zoneController.fetchSingleZone);
router.post("/create", zoneController.createNewZone);
router.post("/update/:id", zoneController.updateZone);
router.post("/delete/:id", zoneController.deleteZone);

module.exports = router;
