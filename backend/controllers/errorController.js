const fs = require("fs");
const handleError = (type, fileName, detail) => {
  console.log("\x1b[41m", type, "\x1b[0m");
  console.log("\x1b[33m", "Check Errors.log for details", "\x1b[0m");
  let logToWrite = `\n<<---${new Date().toLocaleString()}--->>\n"${type}" in ${fileName}\n${detail}\n<<---****--->>\n`;
  fs.writeFileSync("Errors.log", logToWrite, { flag: "a" });
};

module.exports = handleError;
