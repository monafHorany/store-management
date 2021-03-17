const express = require("express");
const sequelize = require("./utils/databaseConnection");
const app = express();
const cors = require("cors");
app.use(cors());

app.use(express.json());

const zone = require("./models/zone");
const hand = require("./models/hands");
const product = require("./models/products");
const user = require("./models/users");

hand.hasMany(product, { onDelete: "cascade", onUpdate: "cascade" });
zone.hasMany(hand, { onDelete: "cascade", onUpdate: "cascade" });

app.use("/hand", require("./routes/hand-route"));
app.use("/zone", require("./routes/zone-route"));
app.use("/product", require("./routes/product-route"));
// app.use("/user", require("./routes/user-route"));

sequelize.sync({}).then(app.listen(5000));
