const express = require("express");
const router = express.Router();
const userController = require("../controller/user");
const {
  protect,
  admin,
  adminANDeditor,
} = require("../middleware/authMiddleware");

router.get("/", userController.fetchAllUsers);
router.post("/login", userController.login);
router.post("/create", userController.addNewUser);
// router.post("/create", protect, admin, userController.addNewUser);
router.put("/:id", protect, admin, userController.updateUser);
router.delete("/:id", protect, admin, userController.deleteUser);

module.exports = router;
