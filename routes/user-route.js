const express = require("express");
const router = express.Router();
const userController = require("../controller/user");

router.post("/login", userController.login);
router.post("/create", userController.addNewUser);

module.exports = router;
