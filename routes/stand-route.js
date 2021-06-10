const express = require("express");
const router = express.Router();
const standController = require("../controller/stand");
const { protect, admin, adminANDeditor } = require("../middleware/authMiddleware");


router.get("/", standController.fetchAllStands);
router.get("/stand/:id", standController.getStandById);
router.get("/:id", standController.fetchAllStandsByZoneId);
router.post("/:id/create", protect, admin, adminANDeditor, standController.createNewStand);
router.post("/update/:id", protect, admin, adminANDeditor, standController.updateStand);
router.post("/delete/:id", protect, admin, adminANDeditor, standController.deleteStand);

module.exports = router;
