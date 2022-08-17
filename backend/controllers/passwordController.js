const User = require("../models/User");
const bcrypt = require("bcrypt");
const updateController = (_id, newPassword) => {
  return new Promise(async (resolve) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log(hashedPassword);
    console.log("ID", _id);
    const isUpdated = await User.findByIdAndUpdate(_id, {
      password: hashedPassword,
    }).exec();
    console.log(isUpdated);
    resolve({
      updated: true,
      message: "Password updated successfully",
    });
  });
};

module.exports = { updateController };
