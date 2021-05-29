const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
const asyncHandler = require("express-async-handler");
const fs = require("fs");
const Order = require("../models/order");
const path = require("path");
const pdf = require("pdf-creator-node");
// const csv = require("csvtojson");
// const Box = require("../models/box");
const OrderItem = require("../models/orderItems");
const sequelize = require("../utils/databaseConnection");

const WooCommerce = new WooCommerceRestApi({
  url: "http://172.105.249.132/",
  consumerKey: "ck_ed53259da480ec781071607da9a821e4f35a91a8",
  consumerSecret: "cs_da54315c1989c598785bcc09d59eaa110b8f3a27",
  wpAPI: true,
  version: "wc/v1",
});
WooCommerce.get(
  `orders?after=${new Date("2021-05-25").toISOString()}&order=asc`
)
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.log(error.response.data);
  });

// const fetchAllOrder = asyncHandler(async (req, res, next) => {
//   let existingOrders;
//   try {
//     existingOrders = await Order.findAll();
//   } catch (err) {
//     return res.status(500).json(err);
//   }
//   if (existingOrders.length === 0) {
//     return res.status(200).json({ messsage: "no orders yet" });
//   }
//   return res.status(200).json(existingOrders);
// });

// const fetchAllOrder = asyncHandler(async (req, res, next) => {
//   const allOrders = Order.findAll();
//   for (let i = 0; i < allOrders.length; i++) {
//     const order = allOrders[i];
//     WooCommerce.get("orders?order=asc")
//       .then((response) => {
//         console.log(response.data);
//         for (let i = 0; i < response.data.length; i++) {
//           const woo_order = response.data[i];
//           if (
//             woo_order.date_created > new Date("2021-05-25") &&
//             order.woo_order_id !== woo_order.date_created
//           ) {
//             try {
//               const result = await sequelize.transaction(async (t) => {
//                 const createdOrder = await Order.create(
//                   {
//                     ordered_by,
//                     is_finished: is_finished || false,
//                     note,
//                   },
//                   { transaction: t }
//                 );

//                 // if (orderItems.length > 0) {
//                 for (i = 0; i < orderItems.length; i++) {
//                   await OrderItem.create(
//                     {
//                       item_name: orderItems[i].item_name,
//                       item_sku: orderItems[i].item_sku,
//                       item_price: orderItems[i].item_price,
//                       item_size: orderItems[i].item_size,
//                       item_color: orderItems[i].item_color,
//                       item_quantity: orderItems[i].item_quantity,
//                       item_link: orderItems[i].item_link,
//                       item_website: orderItems[i].item_website,
//                       item_image_url: orderItems[i].item_image_url,
//                       tracking_number: orderItems[i].tracking_number,
//                       received: orderItems[i].received || false,
//                       match_with_description:
//                         orderItems[i].match_with_description || false,
//                       orderId: createdOrder.id,
//                     },
//                     { transaction: t }
//                   );
//                 }
//               });
//               // }
//               // return res.status(201).json(createdOrder);
//               return res.status(201).json({ message: "new order created" });
//             } catch (err) {
//               throw new Error(err);
//               // return res.status(500).json(err);
//             }
//           }
//         }
//       })
//       .catch((error) => {
//         console.log(error.response.data);
//       });
//   }
// });

// const updateOrder = asyncHandler(async (req, res, next) => {
//   let existedOrder;
//   try {
//     existedOrder = await Order.findByPk(req.params.id);
//     if (!existedOrder) {
//       return res.status(404).json("no Order with the given id");
//     }
//   } catch (error) {
//     return res.status(500).json(error);
//   }
//   const { ordered_by, shipped, is_finished, note } = req.body;
//   let updatedOrder;
//   try {
//     updatedOrder = await existedOrder.update({
//       ordered_by: ordered_by || updatedOrder.product_en_name,
//       shipped: shipped,
//       is_finished: is_finished,
//       note: note || updatedOrder.note,
//     });
//     return res.status(201).json({ message: "updated" });
//   } catch (err) {
//     return res.status(500).json(err);
//   }
// });

// const deleteOrder = asyncHandler(async (req, res, next) => {
//   try {
//     await Order.destroy({
//       where: {
//         id: req.params.id,
//       },
//     });
//   } catch (error) {
//     res.status(500).json(error);
//   }

//   return res.status(201).json("Order deleted successfully");
// });

// const productReport = asyncHandler(async (req, res, next) => {
//   const allProducts = await Product.findAll();
//   console.log(allProducts);
//   const options = {
//     format: "A4",
//     orientation: "portrait",
//     border: "5mm",
//     header: {
//       height: "72mm",
//       contents: '<div style="text-align: center;">ORJEEN</div>',
//     },
//   };

//   const document = {
//     html: `<!DOCTYPE html>
//     <html>
//       <head>
//         <meta charset="utf-8" />
//         <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
//         <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
//         <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
//       </head>
//       <body style=" background-color: #0D1117;color: #0D1117;">
//       <table class="table table-striped table-hover">
//       <thead style=" background-color: #0D1117">
//       <tr>
//         <td style="font-weight: bold !important; background-color: #0D1117 !important; color: white !important">Title</td>
//         <td style="font-weight: bold !important; background-color: #0D1117 !important; color: white !important">Barcode</td>
//         <td style="font-weight: bold !important; background-color: #0D1117 !important; color: white !important">SKU</td>
//         <td style="font-weight: bold !important; background-color: #0D1117 !important; color: white !important">Model</td>
//         <td style="font-weight: bold !important; background-color: #0D1117 !important; color: white !important">Added At</td>
//       </tr>
//       </thead>
//       <tbody>
//       ${allProducts.map(
//         (product) =>
//           `<tr>
//         <td style=" background-color: #0D1117 !important; color: white !important">${
//           product.product_en_name
//         }</td>
//         <td style=" background-color: #0D1117 !important; color: white !important">${
//           product.product_barcode
//         }</td>
//         <td style=" background-color: #0D1117 !important; color: white !important">${
//           product.product_sku
//         }</td>
//         <td style=" background-color: #0D1117 !important; color: white !important">${
//           product.model_number
//         }</td>
//         <td style=" background-color: #0D1117 !important; color: white !important">${new Date(
//           product.createdAt
//         ).toLocaleDateString("en-GB")}</td>
//         </tr>`
//       )}

//       </tbody>
//     </table>

//       </body>
//     </html>
//     `,
//     data: {},
//     path: `./PRODUCT-REPORT.pdf`,
//   };
//   pdf
//     .create(document, options)
//     .then((response) => {
//       const invoiceName = "PRODUCT-REPORT.pdf";
//       const invoicePath = path.resolve(invoiceName);
//       fs.readFile(invoicePath, (err, data) => {
//         if (err) {
//           return console.log("err" + err);
//         }
//         res.setHeader("Content-Type", "application/pdf");
//         res.setHeader(
//           "Content-Disposition",
//           'inline; filename="' + invoiceName + '"'
//         );
//         res.send(data);
//       });
//       console.log(response);
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// });

// const importCsv = asyncHandler(async (req, res, next) => {
//   const jsonArray = await csv().fromFile(
//     "wc-product-export-20-4-2021-1618918484724.csv"
//   );

//   for (let i = 0; i < jsonArray.length; i++) {
//     await Product.create({
//       product_en_name: jsonArray[i].Name,
//       product_en_desc: jsonArray[i]["Short description"].split("\\n").join(""),
//       image_url: jsonArray[i].Images.split(",")[0],
//       product_barcode: null,
//       product_sku: jsonArray[i].SKU,
//       model_number: null,
//     });
//   }

//   return res.status(200).json(jsonArray);
// });

// exports.fetchAllOrder = fetchAllOrder;
// exports.fetchAllOrderItemsByBoxId = fetchAllOrderItemsByBoxId;
// exports.createNewOrder = createNewOrder;
// // exports.importCsv = importCsv;
// exports.updateOrder = updateOrder;
// exports.deleteOrder = deleteOrder;
// // exports.productReport = productReport;
