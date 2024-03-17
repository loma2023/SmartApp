// ******************* Static Code  **********************
const express = require("express");
const app = express();
const port = process.env.PORT || 2024;
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(express.json());
app.use(cookieParser());
require("dotenv").config();

// ******************* Auto Refresh  **********************
const path = require("path");
const livereload = require("livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "public"));
const connectLivereload = require("connect-livereload");
app.use(connectLivereload());
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

// ******************* Connect With DB  **********************
mongoose.connect(`mongodb+srv://eslamloma:eslamloma2891997aya@cluster0.usuu41v.mongodb.net/SmartApp?retryWrites=true&w=majority`)
  .then(() => { app.listen(port, () => { console.log(`http://localhost:${port}/`) }) })
  .catch((err) => { console.log(err) });
// **************************************************************************************


// *******************  Import Routes  **********************
// const UsersRoute = require("./routes/UsersRoute");
const LoginRoute = require("./routes/LoginRoute");
const RegisterRoute = require("./routes/RegisterRoute");
const CustomersRoute = require("./routes/CustomersRoute");
const SuppliersRoute = require("./routes/SuppliersRoute");
const ReceiptsRoute = require("./routes/ReceiptsRoute");
const ProductRoute = require("./routes/ProductRoute");


// app.use(UsersRoute);
app.use(LoginRoute);
app.use(RegisterRoute);
app.use(CustomersRoute);
app.use(SuppliersRoute);
app.use(ReceiptsRoute);
app.use(ProductRoute);
