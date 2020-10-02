const ErrorClass = require("./ErrorClass");

exports.CatchAsync = (fn, errorCode) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      return next(new ErrorClass(err, errorCode));
    });
  };
};
