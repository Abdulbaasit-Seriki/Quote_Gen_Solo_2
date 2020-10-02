const Company = require("../models/companyModel");
const User = require("../models/userModel");
const userController = require("./userController");
const mailService = require("../services/mailService");
const CatchAsync = require("../utils/CatchAsync");
const ErrorClass = require("../utils/ErrorClass");
const uuid = require('uuid')
exports.new = CatchAsync.CatchAsync(async function (req, res, next) {
  const { email, password, admin } = req.body;

  const isExist = await Company.exists({
    email,
  });
  if (isExist) {
    return next(new ErrorClass({ message: "This id is already exist" }, 400));
  }

  if (admin) {
    const { user, token } = await createNewCompany(
      {
        email,
        ...req.body,
      },
      {
        password,
        valid: true,
      },
      false
    );

    return res.status(201).send({
      user,
      token,
      success: true,
    });
  } else {
    const { user, token } = await createNewCompany(
      {
        email,
        ...req.body,
      },
      {
        password,
      },
      !admin
    );

    return res.status(201).send({
      user,
      token,
      success: true,
    });
  }
}, 500);

exports.resendValidateEmail = async function (req, res) {
  const { currentUser } = req;
  const company = await Company.findById(currentUser.company)
  await mailService.sendEmail(
    {
      to: currentUser.email,
      from: process.env.EAMIL,
      subject: "Confirm Your Email",
    },
    {
      validationToken: currentUser.validationToken,
      id: currentUser._id,
      name: company.name,
    },
    "validate"
  );
};
const createNewCompany = async (
  companyData,
  userData = {},
  sendEmail = true
) => {
  const company = new Company(companyData);
  const { _id, email } = await company.save();
  const { token, user } = await userController.createNewUSer({
    company: _id,
    email,
    ...userData,
  });
  sendEmail &&
    (await mailService.sendEmail(
      {
        to: email,
        from: process.env.EAMIL,
        subject: "Confirm Your Email",
      },
      {
        validationToken: user.validationToken,
        id: user._id,
        name: company.name,
      },
      "validate"
    ));
  return {
    user,
    token,
    company,
  };
};

exports.companies = CatchAsync.CatchAsync(async function (req, res, next) {
  const companies = await Company.find({});
  res.send({
    companies,
  });
}, 500);

const createUrl = (currentUser, fileType, apiType, id = undefined,fileName) => {  
  return (
    process.env.DOMAIN_BACK +
    "api/" +
    apiType +
    "/" +
    currentUser +
    "." +
    fileType.name.split(".").pop()
  );
};

exports.increase = CatchAsync.CatchAsync(async function (req, res, next) {
  const { currentUser } = req;
  currentUser.numEmail = currentUser.numEmail + 1;
  currentUser.numLogin = currentUser.numLogin + 1;
  await currentUser.save();
}, 500);

exports.profile = CatchAsync.CatchAsync(async function (req, res, next) {
  const { files, body, token } = req;
  const { logo, prices } = files;
  const { currentUser } = body;

  logo.mv("./logos/" + currentUser + "." + logo.name.split(".").pop());
  prices.mv("./prices/" + currentUser + "." + prices.name.split(".").pop());
  const company = await Company.findByIdAndUpdate(
    currentUser.company,
    {
      logo: createUrl(currentUser, logo, "getLogo"),
      prices: createUrl(currentUser, prices, "getPrices"),
      template: body.template,
    },
    {
      useFindAndModify: false,
    }
  );
  const user = await User.findByIdAndUpdate(
    currentUser,
    {
      complete: true,
    },
    {
      useFindAndModify: false,
    }
  );
  res.status(200).send({
    user,
    token,
    company,
  });
}, 500);

exports.updatePrices = CatchAsync.CatchAsync(async function (req, res, next) {
  const { files, body, token } = req;
  const { currentUser, currentUserCompany, template } = body;
  if (files && files.prices) {
    files.prices.mv(
      "./prices/" + currentUser + "." + files.prices.name.split(".").pop()
    );            
    const company = await Company.findByIdAndUpdate(
      currentUserCompany,
      {
        prices: createUrl(currentUser, files.prices, "getPrices", "id"),
      },
      {
        useFindAndModify: false,
      }
    );
  }

  if (template) {
    const company = await Company.findByIdAndUpdate(
      currentUserCompany,
      {
        template,
      },
      {
        useFindAndModify: false,
      }
    );
  }

  res.status(200).send({
    message : "Update prices successful"
  });
}, 500);

exports.company = CatchAsync.CatchAsync(async function (req, res, next) {
  const { id } = req.params;

  const company = await Company.findById(id);
  const { _id } = await User.findOne({
    company: id,
  }).select(["_id"]);
  res.send({
    company,
    userId: _id,
  });
}, 500);

exports.sendTestEmail = async function (req, res) {
  const { id, email: to, html } = req.body;
  await mailService.sendEmail({
    to,
    html,
    from: process.env.EAMIL,
    subject: "Test- Subject",
  });
  res.send({
    done: true,
  });
};
exports.createNewCompany = createNewCompany;
