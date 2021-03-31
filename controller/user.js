const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

const jwt = require("jsonwebtoken");
const fs = require("fs");
const User = require("../models/users");

const addNewUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, phone_number, role } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ where: { email: email } });
  } catch (err) {
    return res.status(500).json("Signing up failed, please try again later.");
  }

  if (existingUser) {
    return res.status(422).json("User exists already, please login instead.");
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return res.status(500).json(err);
  }
  let createdUser;
  try {
    createdUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone_number,
      role,
    });
  } catch (err) {
    if (err.errors[0].message) {
      return res.status(500).json(err.errors[0].message);
    } else {
      return res.status(500).json(err);
    }
  }

  return res.status(201).json({
    userId: createdUser.id,
    name: createdUser.name,
    email: createdUser.email,
    role: createdUser.role,
  });
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);

  let existingUser;

  try {
    existingUser = await User.findOne({ where: { email: email } });
  } catch (err) {
    return res.status(500).json("Logging in failed, please try again later.");
  }

  if (!existingUser) {
    res.status(403).json("Invalid credentials, could not log you in.");
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    return res
      .status(500)
      .json(
        "Could not log you in, please check your credentials and try again."
      );
  }

  if (!isValidPassword) {
    return res.status(403).json("Invalid credentials, could not log you in.");
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
  } catch (err) {
    return res.status(500).json("Logging in failed, please try again later.");
  }
  console.log(existingUser);
  return res.status(201).json({
    userId: existingUser.id,
    name: existingUser.name,
    email: existingUser.email,
    phone_number: existingUser.phone_number,
    role: existingUser.role,
    token: token,
  });
});

const updateUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const { name, email, password, phone_number, role } = req.body;

  let existingUser;
  try {
    existingUser = await User.findByPk(userId);
  } catch (err) {
    return res
      .status(500)
      .json("some thing went wrong, please try again later.");
  }

  if (!existingUser) {
    return res.status(404).json("no user exist with the given id ");
  }
  if (existingUser.role === "super user") {
    return res
      .status(403)
      .json("you don't have permission to edit or delete this user");
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return res.status(500).json(err);
  }
  let updatedUser;
  try {
    updatedUser = await existingUser.update({
      name: name || existingUser.name,
      email: email || existingUser.email,
      password: hashedPassword || existingUser.password,
      phone_number: phone_number || existingUser.phone_number,
      role: role || existingUser.role,
    });
  } catch (err) {
    if (err.errors[0].message) {
      return res.status(500).json(err.errors[0].message);
    } else {
      return res.status(500).json(err);
    }
  }

  return res.status(201).json("user updated");
});

const fetchAllUsers = asyncHandler(async (req, res, next) => {
  let existingUsers;
  try {
    existingUsers = await User.findAll({
      attributes: { exclude: ["password"] },
    });
  } catch (err) {
    return res.status(500).json(err);
  }
  if (existingUsers.length == 0) {
    return res.status(200).json("no users found");
  }
  return res.status(200).json(existingUsers);
});
const deleteUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  let existingUser;
  try {
    existingUser = await User.findByPk(userId);
    console.log(existingUser);
  } catch (err) {
    return res.status(500).json(err);
  }
  if (!existingUser) {
    return res.status(404).json("no users found with the given id");
  }
  if (existingUser.role === "super user") {
    return res.status(403).json("not authorized");
  } else existingUser.destroy();
  return res.status(201).json("user deleted");
});

exports.addNewUser = addNewUser;
exports.login = login;
exports.fetchAllUsers = fetchAllUsers;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
