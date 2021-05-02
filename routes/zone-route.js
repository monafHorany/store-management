const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const zoneController = require("../controller/zone");

router.get("/:id", zoneController.fetchSingleZone);
router.get("/", zoneController.fetchAllZones);
router.post("/create", protect, admin, zoneController.createNewZone);
router.post("/update/:id", protect, admin, zoneController.updateZone);
router.post("/delete/:id", protect, admin, zoneController.deleteZone);

module.exports = router;
