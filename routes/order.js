const express = require("express");
const router = express.Router();
const orderController = require("../controller/orders");

router.get(
  "/fetchAllOrderFromWoocommerce",
  orderController.fetchAllOrderFromWoocommerce
);
router.get("/fetchAllNewOrder", orderController.fetchAllNewOrder);
router.post("/createBill", orderController.fetchProductBySku);
// router.delete("/delete/:id", locationController.deleteProductFromLocation);

module.exports = router;
