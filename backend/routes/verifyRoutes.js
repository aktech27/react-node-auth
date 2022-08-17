const {
  verifyController,
  OTPController,
} = require("../controllers/verifyController");
const router = require("express").Router();

// Account Verification for new user
router.put("/new/:token", verifyController);

// OTP Verification for forgot password
router.post("/otp", OTPController);

module.exports = router;
