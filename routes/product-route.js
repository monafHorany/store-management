const express = require("express");
const router = express.Router();
const productController = require("../controller/product");
const fileUpload = require('../middleware/file-upload');

router.get("/", productController.fetchAllProducts);
router.post("/create", fileUpload.single('image_url'), productController.createNewProduct);
router.post("/update/:id", productController.updateProduct);
router.post("/delete/:id", productController.deleteproduct);

module.exports = router;
