const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
const asyncHandler = require("express-async-handler");
const moment = require("moment");
const fs = require("fs");
const Order = require("../models/order");
const Product = require("../models/products");
const Stand = require("../models/stands");
const path = require("path");
const pdf = require("pdf-creator-node");
const OrderItem = require("../models/orderItems");
const sequelize = require("../utils/databaseConnection");
const WooCommerce = new WooCommerceRestApi({
  url: "https://www.orjeen.com/",
  consumerKey: "ck_6a4943efca5beb973900d31d6a5e4f397c8116ba",
  consumerSecret: "cs_85a3dcb8a42ce7b2c4714bb1d6027b3196c8bc8e",
  version: "wc/v3",
});
// const WooCommerce = new WooCommerceRestApi({
//   url: "http://172.105.249.132/",
//   consumerKey: "ck_ed53259da480ec781071607da9a821e4f35a91a8",
//   consumerSecret: "cs_da54315c1989c598785bcc09d59eaa110b8f3a27",
//   version: "wc/v3",
// });
const fetchAllNewOrder = asyncHandler(async (req, res, next) => {
  let allOrders;
  try {
    allOrders = await Order.findAll({
      include: OrderItem,
      order: [["woo_order_id", "DESC"]],
    });
    return res.status(200).json(allOrders);
  } catch (error) {
    throw new Error(error);
  }
});

const fetchProductBySku = asyncHandler(async (req, res, next) => {
  let product;
  try {
    product = await Product.findOne({
      where: { product_sku: req.body.sku },
      include: Stand,
    });
    return res.status(200).json(product);
  } catch (error) {
    throw new Error(error);
  }
});

const fetchAllOrderFromWoocommerce = asyncHandler(async (req, res, next) => {
  var threeMonthsAgo = moment().subtract(1, "days");
  const { data } = await WooCommerce.get("orders?page=22&per_page=100");
  let page_num = 1;
  while (true) {
    const { data } = await WooCommerce.get(
      `orders?page=${page_num}&per_page=100&after=${new Date(
        threeMonthsAgo.format()
      ).toISOString()}`
    );
    let createdOrder;
    let updatedOrder;
    const allOrders = await Order.findAll();
    for (let j = 0; j < data.length; j++) {
      const woo_order = data[j];
      var found = allOrders.some((el) => el.woo_order_id === woo_order.id);
      if (!found) {
        try {
          const result = await sequelize.transaction(async (t) => {
            createdOrder = await Order.create(
              {
                order_owner_name:
                  woo_order.billing.first_name +
                  " " +
                  woo_order.billing.last_name,
                order_owner_email: woo_order.billing.email,
                order_owner_phone_number: woo_order.billing.phone,
                order_created_date: woo_order.date_created,
                order_status: woo_order.status,
                billing_address:
                  woo_order.billing.address_1 +
                  " " +
                  woo_order.billing.address_2 +
                  " " +
                  woo_order.billing.city +
                  " " +
                  woo_order.billing.state +
                  " " +
                  woo_order.billing.postcode +
                  " " +
                  woo_order.billing.country,
                shipping_address:
                  woo_order.shipping.address_1 +
                  " " +
                  woo_order.shipping.address_2 +
                  " " +
                  woo_order.shipping.city +
                  " " +
                  woo_order.shipping.country,
                currency: woo_order.currency,
                total: woo_order.total,
                payment_method: woo_order.payment_method_title,
                woo_order_id: woo_order.id,
              },
              { transaction: t }
            );
            for (k = 0; k < woo_order.line_items.length; k++) {
              const orderItem = woo_order.line_items[k];
              if (
                orderItem.name &&
                orderItem.sku &&
                orderItem.price &&
                orderItem.quantity &&
                orderItem.total
              ) {
                await OrderItem.create(
                  {
                    item_name: orderItem.name,
                    item_sku: orderItem.sku,
                    item_price: orderItem.price,
                    item_quantity: orderItem.quantity,
                    total: orderItem.total,
                    orderId: createdOrder.id,
                  },
                  { transaction: t }
                );
              }
            }
          });
        } catch (err) {
          throw new Error(err);
        }
      } else {
        try {
          updatedOrder = await Order.update(
            {
              order_owner_name:
                woo_order.billing.first_name +
                " " +
                woo_order.billing.last_name,
              order_owner_email: woo_order.billing.email,
              order_owner_phone_number: woo_order.billing.phone,
              order_created_date: woo_order.date_created,
              order_status: woo_order.status,
              billing_address:
                woo_order.billing.address_1 +
                " " +
                woo_order.billing.address_2 +
                " " +
                woo_order.billing.city +
                " " +
                woo_order.billing.state +
                " " +
                woo_order.billing.postcode +
                " " +
                woo_order.billing.country,
              shipping_address:
                woo_order.shipping.address_1 +
                " " +
                woo_order.shipping.address_2 +
                " " +
                woo_order.shipping.city +
                " " +
                woo_order.shipping.country,
              currency: woo_order.currency,
              total: woo_order.total,
              payment_method: woo_order.payment_method_title,
              woo_order_id: woo_order.id,
            },
            {
              where: {
                woo_order_id: woo_order.id,
              },
            }
          );
        } catch (error) {
          throw new Error(error);
        }
      }
    }
    page_num++;
    if (data.length === 0) {
      console.log(data.length);
      return res.status(200).json(data);
    }
  }

  // return res.status(200).json(data);
});

const updateOrder = asyncHandler(async (req, res, next) => {
  let existedOrder;
  try {
    existedOrder = await Order.findByPk(req.params.id);
    if (!existedOrder) {
      return res.status(404).json("no Order with the given id");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
  const { ordered_by, shipped, is_finished, note } = req.body;
  let updatedOrder;
  try {
    updatedOrder = await existedOrder.update({
      ordered_by: ordered_by || updatedOrder.product_en_name,
      shipped: shipped,
      is_finished: is_finished,
      note: note || updatedOrder.note,
    });
    return res.status(201).json({ message: "updated" });
  } catch (err) {
    return res.status(500).json(err);
  }
});

const deleteOrder = asyncHandler(async (req, res, next) => {
  try {
    await Order.destroy({
      where: {
        id: req.params.id,
      },
    });
  } catch (error) {
    res.status(500).json(error);
  }

  return res.status(201).json("Order deleted successfully");
});

exports.fetchAllNewOrder = fetchAllNewOrder;
exports.fetchProductBySku = fetchProductBySku;
exports.fetchAllOrderFromWoocommerce = fetchAllOrderFromWoocommerce;
exports.updateOrder = updateOrder;
exports.deleteOrder = deleteOrder;
