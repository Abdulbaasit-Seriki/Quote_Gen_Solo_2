var mongoose = require("mongoose");
var leadSchema = mongoose.Schema({
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  firstNAme: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  }
});
// Export lead model
var Lead = (module.exports = mongoose.model("Lead", leadSchema));
module.exports.get = function (callback, limit) {
  Lead.find(callback).limit(limit);
};
