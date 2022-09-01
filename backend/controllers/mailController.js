const nodemailer = require("nodemailer");
const handleError = require("./errorController");

const mailController = (options) => {
  return new Promise((resolve) => {
    const Gmailer = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    let mail = {
      from: "no-reply@gmail.com",
      to: options.email,
      subject: options.subject,
      html: options.body,
    };
    Gmailer.sendMail(mail, (error) => {
      if (error) {
        handleError("Error in sending mail", __filename, error);
        resolve({ sent: false, msg: "Error in sending Email" });
      } else {
        resolve({ sent: true });
      }
    });
  });
};
module.exports = mailController;
