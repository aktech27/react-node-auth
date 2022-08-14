const router = require("express").Router();
const User = require("../models/User");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Account Verification for new user
router.put("/new/:token", async (req, res) => {
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
    console.log(newToken);
    User.updateOne(
      {
        "verificationToken.token": token,
      },
      {
        "verificationToken.token": newToken,
        "verificationToken.expiry": Date.now() + 60 * 60 * 1000,
      }
    ).exec();
    const Gmailer = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    let mail = {
      from: "no-reply@gmail.com",
      to: isFound.email,
      subject: "Account Verification",
      html: `<h1>Please verify your account here:</h1><br>
      <h3><a href="https://${process.env.URL}/verify/${newToken}" target="_blank">Click here</a> to verify your account.</h3>`,
    };
    Gmailer.sendMail(mail, (error, info) => {
      if (error) {
        console.log(error);
        return res
          .status(422)
          .send({ error: "Failed to send email" });
      } else {
        return res.status(422).json({
          error: "Link expired. New Link has been sent",
        });
      }
    });
  } else {
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
  }
});

// Account Verification for forgot password
router.post("/forgot/:id", async (req, res) => {});

module.exports = router;
