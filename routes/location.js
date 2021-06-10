const express = require("express");
const router = express.Router();
const locationController = require("../controller/location");

router.post("/insertProduct", locationController.insertProductInLocation);
router.put("/edit/:id", locationController.editProducLocation);
router.delete("/delete/:id", locationController.deleteProductFromLocation);

module.exports = router;
