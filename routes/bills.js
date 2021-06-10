const express = require("express");
const router = express.Router();
const billsController = require("../controller/bills");
const { protect, admin, adminANDeditor } = require("../middleware/authMiddleware");


router.get("/fetchAllBills", billsController.fetchAllBills);
router.delete("/delete/:id", protect, admin, billsController.removeBill);

module.exports = router;
