const express = require("express");
const router = express.Router();
const {
  protect,
  admin,
  adminANDeditor,
} = require("../middleware/authMiddleware");
const zoneController = require("../controller/zone");

router.get("/:id", zoneController.fetchSingleZone);
router.get("/", zoneController.fetchAllZones);
router.post(
  "/create",
  protect,
  admin,
  adminANDeditor,
  zoneController.createNewZone
);
router.post(
  "/update/:id",
  protect,
  admin,
  adminANDeditor,
  zoneController.updateZone
);
router.post(
  "/delete/:id",
  protect,
  admin,
  adminANDeditor,
  zoneController.deleteZone
);

module.exports = router;
