const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "e0b572a837967d",
    pass: "ed42ddb18813d2",
  },
});
module.exports = { transporter };
