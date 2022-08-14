const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require("crypto");
const mailController = require("./mailController");

const signinController = async (req, res) => {
  const { email, password } = req.body;

  let existingUser = await User.findOne({ email });
  //Check if user exists and verified
  if (!existingUser)
    return res.status(422).json({ error: "Invalid Credentials" });

  if (!existingUser.accountVerified)
    return res.status(422).json({ error: "Account not verified" });

  let isValidPassword = await bcrypt.compare(
    password,
    existingUser.password
  );

  if (!isValidPassword)
    return res.status(422).json({ error: "Invalid Credentials" });

  //Sign the user with JWT
  const token = jwt.sign(
    { id: existingUser._id },
    process.env.JWT_SECRET,
    { expiresIn: "3h" } //expire after 3 hours
  );

  return res.status(200).json({ message: "Login Successful", token });
};

const signupController = async (req, res) => {
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

  let options = {
    email,
    subject: "Account Verification",
    body: `<h1>Please verify your account here:</h1><br>
  <h3><a href="http://${process.env.URL}/verify/${token}" target="_blank">Click here</a> to verify your account.</h3>`,
  };
  let mailResponse = await mailController(options);
  console.log(mailResponse);

  if (!mailResponse.sent)
    return res.status(500).json({ error: mailResponse.msg });

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
};

module.exports = { signinController, signupController };
