const express = require("express");
const sequelize = require("./utils/databaseConnection");
const app = express();
const path = require("path")
const cors = require("cors");
app.use(cors());

app.use(express.json());

const zone = require("./models/zone");
const stand = require("./models/stands");
const product = require("./models/products");
const user = require("./models/users");

stand.hasMany(product, { onDelete: "cascade", onUpdate: "cascade" });
zone.hasMany(stand, { onDelete: "cascade", onUpdate: "cascade" });
app.use("/uploads/images", express.static(path.join("uploads", "images")));
app.use("/stand", require("./routes/stand-route"));
app.use("/zone", require("./routes/zone-route"));
app.use("/product", require("./routes/product-route"));
// app.use("/user", require("./routes/user-route"));

sequelize.sync().then(app.listen(5000));
