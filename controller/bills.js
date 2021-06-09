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
const removeBill = asyncHandler(async (req, res, next) => {
  let bills;
  console.log(req.params);
  try {
    bills = await Bill.destroy({ where: { id: req.params.id } });
  } catch (error) {
    throw new Error(error);
  }
  return res.status(200).json(bills);
});

exports.fetchAllBills = fetchAllBills;
exports.removeBill = removeBill;
