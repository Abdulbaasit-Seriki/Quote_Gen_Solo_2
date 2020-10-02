const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

module.exports.adminMiddle = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.end("You are not authorized");
  }
  const token = authorization.replace("Bearer ", "");
  const { id } = jwt.decode(token);
  const currentUser = await User.findById(id);
  if (!id || !currentUser || currentUser.role !== "admin") {
    res.end("You are not authorized");
  } else {
    req.currentUser = currentUser;
    req.token = token;
    next();
  }
};

