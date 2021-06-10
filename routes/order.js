const express = require("express");
const router = express.Router();
const orderController = require("../controller/orders");
const { protect, admin, adminANDeditor } = require("../middleware/authMiddleware");


router.get(
  "/fetchAllOrderFromWoocommerce",
  orderController.fetchAllOrderFromWoocommerce
);
router.get("/order/:orderId", orderController.fetchOrderById);
router.get("/fetchAllNewOrder", orderController.fetchAllNewOrder);
router.post("/createBill", protect, admin, adminANDeditor, orderController.processBill);
module.exports = router;
