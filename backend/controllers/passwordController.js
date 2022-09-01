const User = require("../models/User");
const bcrypt = require("bcrypt");
const handleError = require("./errorController");
const updateController = (_id, newPassword) => {
  return new Promise(async (resolve, reject) => {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await User.findByIdAndUpdate(_id, {
        password: hashedPassword,
        passwordChanged: Date.now(),
      }).exec();

      resolve({ success: true, message: "Password changed successfully" });
    } catch (error) {
      handleError("Update Password Error", __filename, error);
      reject({ success: false, error: "Error occured. Please retry" });
    }
  });
};

const changeController = (_id, newPassword, oldPassword) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { password } = await User.findById(_id).select("password");

      //Check if old password is correct
      let isOldPasswordValid = await bcrypt.compare(oldPassword, password);
      if (!isOldPasswordValid) reject({ error: "Old Password is incorrect" });

      //Check if new and old passwords are same
      let isSamePassword = await bcrypt.compare(newPassword, password);
      if (isSamePassword) reject({ error: "New Password cannot be same as old one" });

      if (isOldPasswordValid && !isSamePassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(_id, {
          password: hashedPassword,
          passwordChanged: Date.now(),
        }).exec();
        resolve({ success: true, message: "Password changed successfully" });
      }
    } catch (error) {
      handleError("Change Password Error", __filename, error);
      reject({ error: "Error occured. Please retry" });
    }
  });
};

module.exports = { updateController, changeController };
