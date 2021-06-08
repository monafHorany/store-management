const asyncHandler = require("express-async-handler");
const Bill = require("../models/bill");

const fetchAllBills = asyncHandler(async (req, res, next) => {
  let bills;
  try {
    bills = await Bill.findAll();
  } catch (error) {
    throw new Error(error);
  }
  return res.status(200).json(bills);
});

exports.fetchAllBills = fetchAllBills;
