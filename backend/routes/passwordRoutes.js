const mailController = require("../controllers/mailController");
const {
  updateController,
} = require("../controllers/passwordController");
const User = require("../models/User");
const crypto = require("crypto");

const router = require("express").Router();

// Resetting the password
router.post("/reset", async (req, res) => {
  const { email } = req.body;
  const isFound = User.findOne({ email });
  if (!isFound)
    return res
      .status(422)
      .send({ error: "User with given mail does not exist" });
  let OTP = crypto.randomInt(100000, 999999);
  let options = {
    email,
    subject: "Password Reset - OTP",
    body: `<h1>Your OTP for resetting password</h1><br>
      <h3>Please use the OTP :${OTP} <h2>(Expires in 10 minutes)</h2></h3>`,
  };
  let mailResponse = await mailController(options);
  if (!mailResponse.sent)
    return res.status(500).json({ error: mailResponse.msg });
});

// Updating the password
router.put("/update", async (req, res) => {
  const { email, password } = req.body;
  const isFound = await User.findOne({ email });
  console.log(isFound);
  const updated = await updateController(isFound._id, password);
  console.log(updated);
  res.status(200).json({ message: updated.message });
});

module.exports = router;
