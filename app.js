const express = require("express");
const sequelize = require("./utils/databaseConnection");
const app = express();
const cors = require("cors");
app.use(cors());

app.use(express.json());



sequelize
  .sync()
  .then(
    app.listen(process.env.PORT || 5000),
    console.log(`app is working on port: ${process.env.PORT}`)
  );