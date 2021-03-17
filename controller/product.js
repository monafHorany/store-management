const asyncHandler = require("express-async-handler");
const Product = require("../models/products");

const fetchAllProducts = asyncHandler(async (req, res, next) => {
  let existingProducts;
  try {
    existingProducts = await Product.findAll();
  } catch (err) {
    res.status(500);
    throw new Error(err);
  }
  if (existingProducts.length == 0) {
    return;
  }
  return res.status(200).json(existingProducts);
});

const createNewProduct = asyncHandler(async (req, res, next) => {
  const {
    product_ar_name,
    product_en_name,
    product_en_desc,
    product_ar_desc,
    product_barcode,
    product_sku,
  } = req.body;
  let existingProducts;
  try {
    existingProducts = await Product.findOne({
      where: { product_sku: product_sku },
    });
  } catch (err) {
    res.status(500);
    throw new Error("creating product failed, please try again later.");
  }

  if (existingProducts) {
    res.status(422);
    throw new Error("Product exists already, please login instead.");
  }
  let createdProduct;
  try {
    createdProduct = await Product.create({
      product_ar_name,
      product_en_name,
      product_en_desc,
      product_ar_desc,
      product_barcode,
      SKU_code,
    });
  } catch (err) {
    res.status(500);
    throw new Error("creating product failed, please try again later.");
  }
});

const updateProduct = asyncHandler(async (req, res, next) => {
  const productId = req.params.id;
  let existiedProduct;
  try {
    existiedProduct = await Product.findByPk(productId);
    if (!existiedProduct) {
      res.status(404);
      throw new Error("no product with the given id");
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
  const {
    product_ar_name,
    product_en_name,
    product_en_desc,
    product_ar_desc,
    product_barcode,
    product_sku,
  } = req.body;
  let updatedProduct;
  try {
    if (existiedProduct) {
    }
    updatedProduct = await existiedProduct.update({
      product_ar_name: product_ar_name || existiedProduct.product_ar_name,
      product_en_name: product_en_name || existiedProduct.product_en_name,
      product_en_desc: product_en_desc || existiedProduct.product_en_desc,
      product_ar_desc: product_ar_desc || existiedProduct.product_ar_desc,
      product_barcode: product_barcode || existiedProduct.product_barcode,
      product_sku: product_sku || existiedProduct.product_sku,
    });
    return res.status(202).json(updatedProduct);
  } catch (err) {
    res.status(500);
    throw new Error(err);
  }
});

const deleteproduct = asyncHandler(async (req, res, next) => {
  const productId = req.params.id;
  try {
    await Product.destroy({
      where: {
        id: productId,
      },
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }

  return res.status(201).json({ message: "Product deleted successfully" });
});

exports.fetchAllProducts = fetchAllProducts;
exports.createNewProduct = createNewProduct;
exports.updateProduct = updateProduct;
exports.deleteproduct = deleteproduct;
