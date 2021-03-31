const express = require("express");
const router = express.Router();
const userController = require("../controller/user");
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/", userController.fetchAllUsers);
router.post("/login", userController.login);
router.post("/create", userController.addNewUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
