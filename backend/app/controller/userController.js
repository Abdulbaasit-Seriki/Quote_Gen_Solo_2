const User = require("../models/userModel");
const Log = require("../models/logsModel");
const Company = require("../models/companyModel");
const jwt = require("jsonwebtoken");
const companyController = require("./companyController");
const mailService = require("../services/mailService");
const logService = require("../services/logService");
const CatchAsync = require("../utils/CatchAsync");
const ErrorClass = require("../utils/ErrorClass");

exports.new = CatchAsync.CatchAsync(async function (req, res, next) {
  const { token, user } = await createNewUSer(req.body);
  res.status(201).send({
    user,
    token,
  });
}, 500);
exports.createEmployee = CatchAsync.CatchAsync(async function (req, res, next) {
  const { currentUser } = req;
  logService.log({
    email: currentUser.email,
    role: currentUser.role,
    event: "Creating new employee",
  });
  let data = {
    valid: true,
    complete: true,
    role: "employee",
    ...req.body,
  };
  if (currentUser.role !== "admin") {
    data = {
      ...data,
      company: currentUser.company,
    };
  }

  const user = await new User(data).save();
  const token = await user.generateAuthToken();
  return res.send({
    user,
  });
}, 400);

exports.createNewUSer = async (userData) => {
  const user = await new User(userData).save();
  const token = await user.generateAuthToken();
  return {
    token,
    user,
  };
};

exports.login = CatchAsync.CatchAsync(async function (req, res, next) {
  const { user, token, success } = await handleLogin(req.body);
  if (success) {
    res.send({
      user,
      token,
    });
  } else {
    return next(new ErrorClass({ message: "Wrong email or password" }, 400));
  }
}, 500);

const handleLogin = async function ({ email, password }) {
  const user = await User.findByCredentials(email, password);
  if (!user) {
    return {
      success: false,
    };
  }
  user.numLogin = user.numLogin + 1;
  await user.save();
  const token = await user.generateAuthToken();
  logService.log({
    email: user.email,
    role: user.role,
    event: "This user Loged in",
  });
  return {
    user: user.populate("company"),
    token,
    success: true,
  };
};

exports.logout = CatchAsync.CatchAsync(async (req, res, next) => {
  req.user.tokens = req.user.tokens.filter((toke) => {
    return token.token != req.token;
  });
  await req.user.save();
  res.send();
}, 500);

exports.checkSession = CatchAsync.CatchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization.replace("Bearer ", "");
  const decoded = jwt.decode(token);
  const user = await User.findById(decoded.id).populate("company");
  res.send({
    user,
    token,
  });
}, 500);

exports.validate = async (req, res) => {
  const { token: validationToken, id } = req.body;
  const user = await User.findOneAndUpdate(
    {
      _id: id,
      validationToken,
    },
    {
      valid: true,
    }
  );
  logService.log({
    email: user.email,
    role: user.role,
    event: "Valided his/her email",
  });
  const token = await user.generateAuthToken();
  res.send({
    user,
    token,
  });
};

exports.loginViaGmail = CatchAsync.CatchAsync(async (req, res, next) => {
  const { email, password, name, orgName, phone, logo } = req.body;
  const isCreatedBefore = await User.exists({
    email,
    provider: null,
  });
  if (isCreatedBefore) {
    return next(
      new ErrorClass({ message: "This email is already exist" }, 400)
    );
  }

  const isExist = await User.exists({
    email,
    provider: "Gmail",
  });
  if (isExist) {
    const { user, token, success } = await handleLogin({
      email,
      password,
    });
    return res.send({
      user,
      token,
      success,
    });
  }
  const {
    user: createdUser,
    token: newToken,
  } = await companyController.createNewCompany(
    {
      email,
      name,
      orgName,
      phone,
      logo,
    },
    {
      password,
      provider: "Gmail",
      valid: true,
    },
    false
  );
  logService.log({
    email: user.email,
    role: user.role,
    event: "This user Loged in",
  });
  res.send({
    user: createdUser,
    token: newToken,
  });
}, 500);

exports.createAdmin = CatchAsync.CatchAsync(async (req, res, next) => {
  const { email, name, password } = req.body;

  const user = await this.createNewUSer({
    email,
    password,
    name,
    valid: true,
    complete: true,
    role: "admin",
  });
  const token = await user.generateAuthToken();
  res.send({
    user,
    token,
  });
}, 500);

exports.allUsers = CatchAsync.CatchAsync(async function (req, res, next) {
  const users = await User.find({role : {$in : ["company","employee"]}}).populate("company");
  const numEmail = await User.aggregate([
    {
      $group: {
        _id: null,
        numEmail: {
          $sum: "$numEmail",
        },
        numLogin: {
          $sum: "$numLogin",
        },
        maxQuantity: {
          $max: "$numLogin",
        },
      },
    },
  ]);

  const { numEmail: emails, numLogin: logins } = numEmail[0];
  const mostUsed = await User.find({})
    .sort({
      numEmail: -1,
    })
    .limit(1);
  res.send({
    users,
    emails,
    logins,
    mostUsed: mostUsed.length ? mostUsed[0] : false,
  });
}, 500);

exports.updatePassword = CatchAsync.CatchAsync(async (req, res, next) => {
  const { currentUser } = req;
  logService.log({
    email: currentUser.email,
    role: currentUser.role,
    event: "Updating password",
  });

  currentUser.password = req.body.password;
  currentUser.save();
  res.send({
    success: true,
  });
}, 500);
exports.resetPassword = CatchAsync.CatchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({
    email,
  });
  logService.log({
    email: user.email,
    role: user.role,
    event: "Trying to rest the password",
  });
  if (user) {
    const resetToken = await user.createResetPasswordToken();
    await mailService.sendEmail(
      {
        to: email,
        from: process.env.EMAIL,
        subject: "Reset Password",
      },
      {
        resetToken,
        id: user._id,
      },
      "resetPassword"
    );
    res.send({
      success: true,
    });
  } else {
    return next(new ErrorClass({ message: "This email is not exist " }, 400));
  }
}, 500);

exports.validResetPassword = async (req, res, next) => {
  const { token, id } = req.body;
  const user = await User.findOne({
    _id: id,
    resetPasswordToken: token,
  });
  if (user) {
    const token = await user.generateAuthToken();
    res.send({
      token: token,
    });
  } else {
    return next(new ErrorClass({ message: "This is wrong token" }, 400));
  }
};
// for delete current user
exports.delete = CatchAsync.CatchAsync(async (req, res, next) => {
  const currentUser = req.user;
  logService.log({
    email: currentUser.email,
    role: currentUser.role,
    event: "This user deleted his/her account",
  });
  await User.deleteMany({
    company: currentUser.company,
  });
  await Company.remove({
    _id: currentUser.company,
  });
  return res.send({
    success: true,
  });
}, 500);

// for delete user
exports.deleteUser = async (req, res) => {
  const { currentUser } = req;
  const user = await User.findByIdAndDelete(req.body.id);
  logService.log({
    email: user.email,
    role: user.role,
    event: `This account has been deleted by ${currentUser.email}`,
  });

  if (user.role === "company") {
    const users = await User.deleteMany({
      company: user.company,
    });
    const company = await Company.remove({
      _id: user.company,
    });
  }
  const users = await User.find({}).populate("company");
  const numEmail = await User.aggregate([
    {
      $group: {
        _id: null,
        numEmail: {
          $sum: "$numEmail",
        },
        numLogin: {
          $sum: "$numLogin",
        },
        maxQuantity: {
          $max: "$numLogin",
        },
      },
    },
  ]);

  const { numEmail: emails, numLogin: logins } = numEmail[0];
  const mostUsed = await User.find({})
    .sort({
      numLogin: -1,
    })
    .limit(1);
  return res.send({
    users,
    emails,
    logins,
    mostUsed: mostUsed.length ? mostUsed[0] : false,
    success: true,
  });
};

exports.checkPassword = async function (req, res) {
  const { currentUser, body } = req;
  const user = await User.findByCredentials(currentUser.email, body.password);
  if (!user) {
    return res.send({
      success: false,
    });
  }
  return res.send({
    success: true,
  });
};

exports.allEmployees = async function (req, res) {
  const { currentUser } = req;
  const users = await User.find({
    role: "employee",
    company: currentUser.company,
  });
  return res.send({
    users,
  });
};

exports.allLogs = async function (req, res) {
  const { role } = req.body.currentUser
  if (role == 'admin') {
    let logs = await Log.find({role : {$in : ["company","employee"]}})
    return res.send({
      logs
    })
  }
  if (role == 'company') {
    const { company: companyID } = req.body.currentUser
    const users = await User.find({ company: companyID, role: 'employee' })
    const emails = Array.from(users).map(user => user.email)
    let logs = await Log.find({ email: { $in: [...emails] } }).exec()
    return res.send({
      logs,
    });
  }
};
