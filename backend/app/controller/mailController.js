const mailService = require("../services/mailService");
exports.sendMail = async (req, res) => {
  const { currentUser, body } = req;
  const { emailTo: to, lead: html } = body;
  currentUser.numEmail = currentUser.numEmail + 1;
  await currentUser.save();
  await mailService.sendEmail({
    to,
    html,
    from: process.env.EAMIL,
    subject: "Subject",
  });

  res.send({ done: true });
};
