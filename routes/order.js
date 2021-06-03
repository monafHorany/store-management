const express = require("express");
const router = express.Router();
const orderController = require("../controller/orders");
const testController = require("../controller/testing");

router.get(
  "/fetchAllOrderFromWoocommerce",
  orderController.fetchAllOrderFromWoocommerce
);
router.get("/order/:orderId", orderController.fetchOrderById);
router.get(
  "/fetchAllOrderFromWoocommerceTest",
  testController.fetchAllOrderFromWoocommerce
);
router.get("/fetchAllNewOrder", orderController.fetchAllNewOrder);
router.post("/createBill", orderController.fetchProductBySku);
// router.delete("/delete/:id", locationController.deleteProductFromLocation);

module.exports = router;
