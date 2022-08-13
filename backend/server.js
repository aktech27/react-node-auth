const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();

//Connect to database
mongoose
  .connect(process.env.MONGO_DEV_URI)
  .then(() => {
    console.log("Connect to DB");
  })
  .catch((e) => {
    console.log("Unable to connect to DB");
  });

const app = express();

app.use(express.json());

//Routes
app.use("/api/auth", authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port:${process.env.PORT}`);
});
