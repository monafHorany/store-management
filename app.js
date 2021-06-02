const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
app.use(express.json());
const path = require("path");
const cors = require("cors");
app.use(cors());
const sequelize = require("./utils/databaseConnection");

const zone = require("./models/zone");
const stand = require("./models/stands");
const product = require("./models/products");
const user = require("./models/users");
const Refund = require("./models/refund");
const Location = require("./models/location");
const Order = require("./models/order");
const OrderItem = require("./models/orderItems");

stand.belongsToMany(product, {
  through: Location,
  onDelete: "cascade",
  onUpdate: "cascade",
});
product.belongsToMany(stand, {
  through: Location,
  onDelete: "cascade",
  onUpdate: "cascade",
});
zone.hasMany(stand, { onDelete: "cascade", onUpdate: "cascade" });
Order.hasMany(OrderItem, { onDelete: "cascade", onUpdate: "cascade" });
app.use("/uploads/images", express.static(path.join("uploads", "images")));
app.use("/stand", require("./routes/stand-route"));
app.use("/zone", require("./routes/zone-route"));
app.use("/product", require("./routes/product-route"));
app.use("/user", require("./routes/user-route"));
app.use("/location", require("./routes/location"));
app.use("/order", require("./routes/order"));

sequelize.sync().then(app.listen(5000));
