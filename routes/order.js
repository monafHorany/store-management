const express = require("express");
const router = express.Router();
const orderController = require("../controller/orders");

router.get("/fetchAllNewOrder", orderController.fetchAllOrder);
// router.delete("/delete/:id", locationController.deleteProductFromLocation);

module.exports = router;
