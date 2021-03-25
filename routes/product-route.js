const express = require("express");
const router = express.Router();
const productController = require("../controller/product");
const fileUpload = require("../middleware/file-upload");

router.get("/", productController.fetchAllProducts);
router.post(
  "/create",
  fileUpload.single("image_url"),
  productController.createNewProduct
);
router.post(
  "/update/:id",
  fileUpload.single("image_url"),
  productController.updateProduct
);
router.delete("/delete/:id", productController.deleteproduct);

module.exports = router;
