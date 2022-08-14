const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  accountVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    token: { type: String },
    expiry: { type: Date, default: Date.now() },
    // + 60 * 60 * 1000
  },
});

module.exports = mongoose.model("Users", userSchema);
