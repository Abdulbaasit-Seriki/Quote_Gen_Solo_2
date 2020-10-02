const mongoose = require("mongoose");
const validator = require("validator");

const companySchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: (value) => {
      if (!validator.isEmail(value)) {
        throw new Error({
          error: "Invalid Email address"
        });
      }
    },
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  orgName: {
    type: String,
    required: true,
  },
  template: {
    type: String,
  },
  logo: {
    type: String,
  },
  prices: {
    type: String,
  },
});

const Company = mongoose.model("Company", companySchema);

module.exports = Company;