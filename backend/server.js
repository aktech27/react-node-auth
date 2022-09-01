const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const verifyRoutes = require("./routes/verifyRoutes");
const passwordRoutes = require("./routes/passwordRoutes");
const dataRoutes = require("./routes/dataRoutes");
const errorHandler = require("./controllers/errorController");
require("dotenv").config();

//Connect to database
mongoose
  .connect(process.env.MONGO_DEV_URI)
  .then(() => {
    console.log("Connect to DB");
  })
  .catch((e) => {
    errorHandler("Database Connection Error", __filename, e);
  });

const app = express();

app.use(express.json());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/verify", verifyRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/data", dataRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port:${process.env.PORT}`);
});
