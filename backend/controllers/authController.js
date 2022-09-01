const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require("crypto");
const mailController = require("./mailController");
const handleError = require("./errorController");

const signinController = async (req, res) => {
  try {
    const { email, password } = req.body;

    let existingUser = await User.findOne({ email });

    if (!existingUser) return res.status(422).json({ error: "Invalid Credentials" });

    if (!existingUser.accountVerified)
      return res.status(422).json({ error: "Account not verified" });

    let isValidPassword = await bcrypt.compare(password, existingUser.password);

    if (!isValidPassword) return res.status(422).json({ error: "Invalid Credentials" });

    //Sign the user with JWT - expires after 3 hours
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: "3h" });

    //To prevent current Login session being shown for Last Login, it has array with 2 index for previous and current

    await User.updateOne(
      { _id: existingUser._id },
      { lastLogin: [existingUser.lastLogin[1], Date.now()] }
    ).exec();

    return res.status(200).json({ message: "Login Successful", token });
  } catch (error) {
    handleError("Signin Error", __filename, error);
  }
};

const signupController = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    //Check if user exists
    let existingUser = await User.findOne({ email });
    if (existingUser) return res.status(422).json({ error: "User with this email already exists" });

    //Hashing the password - saltrounds 10
    const hashedPassword = await bcrypt.hash(password, 10).catch((e) => console.log(e));

    //Creating account token for verification
    let token = crypto.randomBytes(16).toString("hex");

    let options = {
      email,
      subject: "Account Verification",
      body: `<h1>Please verify your account here:</h1><br>
  <h3><a href="http://${process.env.URL}/verify/${token}" target="_blank">Click here</a> to verify your account.</h3>`,
    };
    let mailResponse = await mailController(options);

    if (!mailResponse.sent) return res.status(500).json({ error: mailResponse.msg });

    //Creating an user object
    let newUser = {
      name,
      email,
      password: hashedPassword,
      verificationToken: { token },
    };

    //Saving to MongoDB
    await new User(newUser).save();

    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    handleError("Signup Error", __filename, error);
  }
};

module.exports = { signinController, signupController };
