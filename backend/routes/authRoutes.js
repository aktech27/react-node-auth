const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Log in the user
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  let existingUser = await User.findOne({ email });
  //Check if user exists and verified
  if (!existingUser) {
    return res
      .status(422)
      .json({ error: "Invalid Email or password" });
  }
  if (!existingUser.accountVerified) {
    return res.status(422).json({ error: "Account not verified" });
  }

  //Check for password match
  let validPassword = await bcrypt.compare(
    password,
    existingUser.password
  );

  if (!validPassword) {
    return res
      .status(422)
      .json({ error: "Invalid Email or password" });
  }

  //Sign the user with JWT
  const token = jwt.sign(
    { id: existingUser._id },
    process.env.JWT_SECRET,
    { expiresIn: "3h" } //expire after 3 hours
  );

  res.status(200).json({ message: "Login Successful", token });
});

//Register the user
router.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;
  //Check if user exists
  let existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(422)
      .json({ error: "User with this email already exists" });
  }

  //Hashing the password - saltrounds 10
  const hashedPassword = await bcrypt
    .hash(password, 10)
    .catch((e) => console.log(e));

  //Creating account token for verification
  let token = crypto.randomBytes(16).toString("hex");
  const Gmailer = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  let mail = {
    from: "no-reply@gmail.com",
    to: email,
    subject: "Account Verification",
    html: `<h1>Please verify your account here:</h1><br>
    <h3><a href="http://${process.env.URL}/verify/${token}" target="_blank">Click here</a> to verify your account.</h3>`,
  };
  Gmailer.sendMail(mail, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(422).send({ error: "Failed to send email" });
    }
  });

  //Creating an user object
  let newUser = {
    name,
    email,
    password: hashedPassword,
    verificationToken: {
      token,
    },
  };

  //Saving to MongoDB
  await new User(newUser).save();

  res.status(200).json({ message: "User registered successfully" });
});

module.exports = router;
