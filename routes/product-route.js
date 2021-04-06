const express = require("express");
const router = express.Router();
const productController = require("../controller/product");
const { protect, admin } = require("../middleware/authMiddleware");

const fileUpload = require("../middleware/file-upload");

router.get("/", productController.fetchAllProducts);
router.get("/:standId", productController.fetchAllProductsByStandId);
router.post(
  "/create",
  fileUpload.single("image_url"),
  productController.createNewProduct
);
router.post("/update/:id", productController.updateProduct);
router.delete("/delete/:id", protect, admin, productController.deleteProduct);

module.exports = router;
