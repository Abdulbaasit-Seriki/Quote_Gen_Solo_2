const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    validate: (value) => {
      if (!validator.isEmail(value)) {
        throw new Error({ error: "Invalid Email address" });
      }
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 7,
    select: false,
  },
  role: { type: String, default: "company" },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: false,
  },
  valid: {
    type: Boolean,
    default: false,
  },
  complete: {
    type: Boolean,
    default: false,
  },
  provider: {
    // null or Gmail
    type: String,
    default: null,
    required: false,
  },
  validationToken: {
    // auto created
    type: String,
  },
  numLogin: {
    type: Number,
    default: 0,
    required: false,
  },
  numEmail: {
    type: Number,
    default: 0,
    required: false,
  },
  resetPasswordToken: {
    type: String,
    default: null,
    required: false,
  },
});
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  if (!user.valid) {
    user.validationToken = crypto.randomBytes(64).toString("hex");
  }
  next();
});
userSchema.index({ email: 1, provider: 1 }, { unique: true });
userSchema.methods.generateAuthToken = async function () {
  const { role, _id } = this;
  // process.env.JWT_KEY -> Bearer should be replaced by this
  return jwt.sign({ id: _id, role }, process.env.JWT_KEY);
};
userSchema.methods.createResetPasswordToken = async function () {
  this.resetPasswordToken = crypto.randomBytes(64).toString("hex");
  this.save();
  return this.resetPasswordToken;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return false;
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return false;
  }
  return user;
};

const User = mongoose.model("Users", userSchema);

module.exports = User;
