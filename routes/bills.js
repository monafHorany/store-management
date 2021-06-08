const express = require("express");
const router = express.Router();
const billsController = require("../controller/bills");

router.get("/fetchAllBills", billsController.fetchAllBills);

module.exports = router;
