const router = require("express").Router();
const {
  signinController,
  signupController,
} = require("../controllers/authController");

// Log in the user
router.post("/signin", signinController);

//Register the user
router.post("/signup", signupController);

module.exports = router;
