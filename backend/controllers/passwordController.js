const User = require("../models/User");
const bcrypt = require("bcrypt");
const updateController = (_id, newPassword) => {
  return new Promise(async (resolve, reject) => {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.findByIdAndUpdate(_id, {
        password: hashedPassword,
      }).exec();
      resolve({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      console.log("Update Password Error\n\n", err);
      reject({
        success: false,
        error: "Error occured. Please retry",
      });
    }
  });
};

module.exports = { updateController };
