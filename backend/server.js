const express = require("express");
const app = express();
const allroutes = require("./Routes/routes");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var cors = require("cors");
// const env = require("dotenv").config();
let port = 3000;
app.use(cors());
let StartServer = async () => {
  app.use("/todo", allroutes);
  app.listen(port, () => {
    console.log(`port is running on http://localhost:${port}/todo/`);
  });
};
// middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
//db connection start
let dbconnection = async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/todo");
  // await mongoose.connect(env.parsed.dburl);
  console.log("database is connected");
};
dbconnection();
StartServer();
