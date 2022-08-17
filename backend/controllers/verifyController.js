const User = require("../models/User");
const crypto = require("crypto");
const mailController = require("./mailController");

const verifyController = async (req, res) => {
  const { token } = req.params;
  let isFound = await User.findOne({
    "verificationToken.token": token,
  }).select("verificationToken email");
  if (!isFound) {
    return res
      .status(422)
      .json({ error: "Invalid token or Account already verified" });
  }
  if (Date.parse(isFound.verificationToken.expiry) < Date.now()) {
    let newToken = crypto.randomBytes(16).toString("hex");
    User.updateOne(
      {
        "verificationToken.token": token,
      },
      {
        "verificationToken.token": newToken,
        "verificationToken.expiry": Date.now() + 60 * 60 * 1000,
      }
    ).exec();

    let options = {
      email: isFound.email,
      subject: "Account Verification",
      body: `<h1>Please verify your account here:</h1><br>
      <h3><a href="http://${process.env.URL}/verify/${newToken}" target="_blank">Click here</a> to verify your account.</h3>`,
    };

    let mailResponse = await mailController(options);
    if (!mailResponse.sent)
      return res.status(500).json({ error: mailResponse.msg });
    return res
      .status(200)
      .json({ message: "Link Expired, New link sent to mail" });
  }
  User.updateOne(
    {
      "verificationToken.token": token,
    },
    {
      "verificationToken.token": null,
      "verificationToken.expiry": null,
      accountVerified: true,
    }
  ).exec();
  return res
    .status(200)
    .json({ message: "Account Verified Successfully" });
};

const OTPController = async (req, res) => {
  const { OTP } = req.body;
  const isFound = await User.findOne({
    "passwordReset.otp": OTP,
  });

  if (!isFound || isFound.passwordReset.otp !== OTP)
    return res.status(422).json({ error: "Incorrect OTP" });
  if (Date.parse(isFound.passwordReset.expiry) < Date.now()) {
    return res.status(422).json({ error: "OTP has expired" });
  }
  User.updateOne(
    {
      "passwordReset.otp": OTP,
    },
    {
      "passwordReset.otp": null,
      "passwordReset.expiry": null,
    }
  );
  return res
    .status(200)
    .json({ message: "OTP Verified Successfully" });
};

module.exports = { verifyController, OTPController };
