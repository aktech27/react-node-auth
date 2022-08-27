const mailController = require("../controllers/mailController");
const { updateController, changeController } = require("../controllers/passwordController");
const User = require("../models/User");
const crypto = require("crypto");
const isAuthorized = require("../middleware/isAuthorized");
const router = require("express").Router();

// Resetting the password
router.post("/reset", async (req, res) => {
  const { email } = req.body;

  let OTP = crypto.randomInt(100000, 999999);
  let isUpdated = await User.updateOne(
    { email },
    {
      "passwordReset.otp": OTP,
      "passwordReset.expiry": Date.now() + 10 * 60 * 1000, //10 minutes
    }
  );
  if (!isUpdated.matchedCount)
    return res.status(422).send({ error: "User with given mail does not exist" });

  let options = {
    email,
    subject: "Password Reset - OTP",
    body: `<h1>Your OTP for resetting password</h1><br>
      <h3>Please use the OTP :${OTP} <h2>(Expires in 10 minutes)</h2></h3>`,
  };
  let mailResponse = await mailController(options);
  if (!mailResponse.sent) return res.status(500).json({ error: mailResponse.msg });
  res.status(200).json({ message: "OTP sent to the registered email" });
});

// Updating the password
router.put("/update", async (req, res) => {
  const { email, newPassword } = req.body;
  const isFound = await User.findOne({ email });
  console.log(isFound);
  const updated = await updateController(isFound._id, newPassword);
  res.status(200).json({ message: updated.message });
});

router.put("/change", isAuthorized, async (req, res) => {
  const { newPassword, oldPassword } = req.body;
  const { _id } = req.user;
  const changed = await changeController(_id, newPassword, oldPassword).catch((e) => {
    res.status(422).json(e);
  });
  if (changed) res.status(200).json({ message: changed.message });
});

module.exports = router;
