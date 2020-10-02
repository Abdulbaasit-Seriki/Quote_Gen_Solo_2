const nodemailer = require("nodemailer");
const Email = require("email-templates");
const dotenv = require("dotenv");
const ErrorClass = require("../utils/ErrorClass");
const CatchAsync = require("../utils/CatchAsync");
dotenv.config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: `${process.env.EMAIL}`,
    pass: `${process.env.EMAIL_PASSWORD}`, // naturally, replace both with your real credentials or an application-specific password
  },
});
exports.sendEmail = CatchAsync.CatchAsync(
  async (mailOptions, locals = {}, template = "") => {
    const { to, from } = mailOptions;
    if (template) {
      const email = new Email({
        message: {
          from,
        },
        // uncomment below to send emails in development/test env:
        send: true,
        transport: transporter,
      });
      return await email.send({
        template,
        message: {
          to,
        },
        locals,
      });
    }
    return transporter.sendMail(mailOptions);
  },
  500
);
