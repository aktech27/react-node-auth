const User = require("../models/User");

const accountController = async (req, res) => {
  let accountInfo = await User.findById(req.user._id).select(
    "-password -verificationToken -passwordReset"
  );
  res.status(200).json(accountInfo);
};

module.exports = { accountController };
