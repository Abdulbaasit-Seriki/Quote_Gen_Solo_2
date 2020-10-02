var mongoose = require("mongoose");
var moment = require('moment')
var logSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    event: {
      type: String,
      required: true,
    },
    date : {
      type : String,
      default : moment().format('DD-MM-YYYY hh:mm')
    }
  }
);
// Export lead model
var Log = (module.exports = mongoose.model("Log", logSchema));

module.exports = Log;
