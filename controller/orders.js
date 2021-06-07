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
const Location = require("../models/location");
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

const fetchOrderById = asyncHandler(async (req, res, next) => {
  // console.log("called");
  // const { data } = await WooCommerce.get(`orders`);

  // return res.json(data);
  let order;
  try {
    order = await Order.findOne({
      where: {
        woo_order_id: +req.params.orderId,
      },
      include: OrderItem,
    });
    return res.status(200).json(order);
  } catch (error) {
    throw new Error(error);
  }
});

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
  // const orderIds = [
  //   47172, 48325, 48374, 50490, 51169, 51159, 51159, 51074, 51718, 51714, 51534,
  //   51530, 51387, 51371,
  // ];
  // const update = {
  //   status: "cancelled",
  // };
  // orderIds.map(async (id) => {
  //   const { data } = await WooCommerce.put(`orders/${id}`, update);
  // });
  var threeMonthsAgo = moment().subtract(1, "days");
  await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
  await OrderItem.destroy({
    truncate: true,
  });
  await Order.destroy({
    truncate: true,
  });
  let page_num = 1;
  while (true) {
    const { data } = await WooCommerce.get(
      `orders?page=${page_num}&per_page=100&after=${new Date(
        threeMonthsAgo.format()
      ).toISOString()}`
    );
    let createdOrder;
    for (let j = 0; j < data.length; j++) {
      const woo_order = data[j];
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
              is_bundled:
                woo_order.line_items[0] &&
                woo_order.line_items[0].meta_data[0] &&
                woo_order.line_items[0].meta_data[0].key === "_bundled_items"
                  ? true
                  : false,
            },
            { transaction: t }
          );
          for (k = 0; k < woo_order.line_items.length; k++) {
            const orderItem = woo_order.line_items[k];
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
        });
      } catch (err) {
        throw new Error(err);
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
const processBill = asyncHandler(async (req, res, next) => {
  const orderItems = req.body;
  let message = "";
  let product;
  if (orderItems.length <= 0) {
    return;
  }
  for (let index = 0; index < orderItems.length; index++) {
    const item = orderItems[index];
    product = await Product.findOne({
      where: {
        product_sku: item.item_sku,
      },
      include: Stand,
    });
    if (!product.stands || product.stands.length <= 0) {
      return res
        .status(404)
        .json("some product of this order isn't exist at any location");
    }
  }
  for (let index = 0; index < orderItems.length; index++) {
    const item = orderItems[index];
    try {
    } catch (error) {
      throw new Error(error);
    }

    try {
      for (let index2 = 0; index2 < product.stands.length; index2++) {
        const stand = product.stands[index2];
        if (stand.location.quantity >= item.item_quantity) {
          try {
            await Location.update(
              { quantity: stand.location.quantity - item.item_quantity },
              { where: { id: stand.location.id } }
            );
            const standDetail = await Stand.findByPk(stand.id);
            message += `<div>
              ${
                item.item_quantity > 1
                  ? item.item_quantity +
                    " peices of " +
                    item.item_name +
                    " are take from zone " +
                    stand.location.zone_Symbol +
                    " in stand #" +
                    standDetail.stand_number
                  : item.item_quantity +
                    " peice of " +
                    item.item_name +
                    " is take from zone " +
                    stand.location.zone_Symbol +
                    " in stand #" +
                    standDetail.stand_number
              }
              </div>`;
          } catch (error) {
            throw new Error(error);
          }
        } else if (stand.location.quantity === 0) {
          try {
            await Location.destroy({
              where: {
                id: stand.location.id,
              },
            });
            return res
              .status(400)
              .json("Please Check The quantity in The Stands");
          } catch (error) {
            throw new Error(error);
          }
        } else {
          return res
            .status(404)
            .json(
              "single stand must have the whole quantity for each order item to be pulled"
            );
        }
      }
    } catch (error) {
      throw new Error(error);
    }

    // if (product.stands.length > 1) {
    //   for (let index2 = 0; index2 < product.stands.length; index2++) {
    //     const stand = product.stands[index2];
    //     if(stand.location.quantity < item.item_quantity){
    //       const subtraction = item.item_quantity - stand.location.quantity;

    //     }
    //     await Location.update({
    //       quantity: stand.location.quantity - item.item_quantity
    //     })
    //   }
    // }
    // if (
    //   item.item_quantity >
    //   product.stands.reduce(
    //     (acc, currentValue) => acc + currentValue.location.quantity,
    //     0
    //   )
    // )
  }
  return res.status(201).json(message);
  // console.log(orderItems);
  // return res.json(product);
});

exports.fetchAllNewOrder = fetchAllNewOrder;
exports.processBill = processBill;
exports.fetchOrderById = fetchOrderById;
exports.fetchProductBySku = fetchProductBySku;
exports.fetchAllOrderFromWoocommerce = fetchAllOrderFromWoocommerce;
exports.updateOrder = updateOrder;
exports.deleteOrder = deleteOrder;
