const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ERROR = { error: "Unauthorized. Please login to continue" };
const isAuthorized = (req, res, next) => {
  //Callback for JWT verify
  const callback = async (error, payload) => {
    if (error) return res.status(401).json(ERROR);
    const { id } = payload;
    const user = await User.findById(id).select("_id email name");
    if (!user) return res.status(401).json(ERROR);
    req.user = user;
    next();
  };

  let { authorization } = req.headers;
  if (!authorization) return res.status(401).json(ERROR);
  let jwtToken = authorization.replace("Bearer ", ""); //Extracting token alone from header
  jwt.verify(jwtToken, process.env.JWT_SECRET, callback);
};
module.exports = isAuthorized;
