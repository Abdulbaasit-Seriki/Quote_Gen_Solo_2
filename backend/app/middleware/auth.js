const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const CatchAsync = require("../utils/CatchAsync");
const ErrorClass = require("../utils/ErrorClass");

module.exports.protect = CatchAsync.CatchAsync(async (req, res, next) => {
  if (!req.headers.authorization) {
    return next(
      new ErrorClass(
        { message: "You are not authorized to visit this route" },
        401
      )
    );
  }

  const token = req.headers.authorization.replace("Bearer ", "");
  const decoded = jwt.decode(token);
  const user = await User.findById(decoded.id);
  
  req.user = user;
  req.currentUser  = user;
  next();
}, 500);
