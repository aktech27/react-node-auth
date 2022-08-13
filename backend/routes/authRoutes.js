const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Log in the user
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  //Check if user exists
  let existingUser = await User.findOne({ email });
  if (!existingUser) {
    return res
      .status(422)
      .json({ error: "Invalid Email or password" });
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

  //Creating an user object
  let newUser = {
    name,
    email,
    password: hashedPassword,
  };

  //Saving to MongoDB
  let created = await new User(newUser).save();
  console.log(created);

  res.status(200).json({ message: "User registered successfully" });
});

module.exports = router;
