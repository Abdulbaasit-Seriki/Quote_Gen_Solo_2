const Log = require("../models/logsModel");
exports.log = async (data) => {
   await new Log(data).save();
};