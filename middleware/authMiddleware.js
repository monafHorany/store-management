const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/users.js");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);

      req.user = await User.findByPk(decoded.userId);
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const admin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "super user") {
    next();
  } else {
    res.status(401).json("Not authorized as an admin");
  }
});
const editor = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "editor") {
    next();
  } else {
    res.status(401).json("Not authorized as an editor");
  }
});

exports.protect = protect;
exports.admin = admin;
exports.editor = editor;
