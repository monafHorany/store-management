const express = require("express");
const router = express.Router();
const productController = require("../controller/product");

router.get("/", productController.fetchAllProducts);
router.post("/create", productController.createNewProduct);
router.post("/update/:id", productController.updateProduct);
router.post("/delete/:id", productController.deleteproduct);

module.exports = router;
