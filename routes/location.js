const express = require("express");
const router = express.Router();
const locationController = require("../controller/location");
const {
  protect,
  admin,
  adminANDeditor,
} = require("../middleware/authMiddleware");

router.post(
  "/insertProduct",
  protect,
  admin,
  locationController.insertProductInLocation
);
router.put("/edit/:id", protect, admin, locationController.editProducLocation);
router.delete(
  "/delete/:id",
  protect,
  admin,
  locationController.deleteProductFromLocation
);

module.exports = router;
