// utils.js
const otpStore = require('./otpStore');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const jwt = require('jsonwebtoken');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '21cs34@lingayasvidyapeeth.edu.in',
    pass: '21cs34@aA',
  },
});

const sendOTP = (email) => {
  return new Promise((resolve, reject) => {
    const otp = randomstring.generate({ length: 6, charset: 'numeric' });
    otpStore[email.toLowerCase()] = otp;
    console.log("otp",otp)
    const mailOptions = {
      from: 'GupChup <21cs34@lingayasvidyapeeth.edu.in>',
      to: email,
      subject: 'GupChup - OTP Verification for Sign Up',
      html: `
        <div style="font-family: Helvetica, Arial, sans-serif; min-width: 1000px; overflow: auto; line-height: 2">
          <div style="margin: 50px auto; width: 70%; padding: 20px 0; background-color: #f8f8f8; border-radius: 8px;">
            <div style="border-bottom: 1px solid #eee; padding-bottom: 10px; text-align: center;">
              <a href="" style="font-size: 1.4em; color: #00466a; text-decoration: none; font-weight: 600;">GupChup - A Highly Secure App</a>
            </div>
            <p style="font-size: 1.1em; margin: 20px 0;">Hi,</p>
            <p style="font-size: 1.1em;">Thank you for choosing GupChup - A highly secure app. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes.</p>
            <h2 style="background: #00466a; margin: 20px auto; width: max-content; padding: 10px; color: #fff; border-radius: 4px; font-size: 1.5em;">${otp}</h2>
            <p style="font-size: 1.1em; margin-top: 20px;">This OTP is crucial for your account security. Do not share it with anyone.</p>
            <p style="font-size: 0.9em; margin-bottom: 10px;">Regards,<br />Your Brand</p>
            <hr style="border: none; border-top: 1px solid #eee" />
            <div style="float: right; padding: 8px 0; color: #aaa; font-size: 0.8em; line-height: 1; font-weight: 300;">
              <p>GupChup Inc</p>
              <p>Powered by @ankit</p>
              <p>Faridabad</p>
            </div>
          </div>
        </div>
      `,
    };
    
    

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error('Error sending email:', error);
        reject('Error sending email');
      } else {
        resolve(otp);
      }
    });
  });
};

const verifyOTP = (storedOtp, otp) => storedOtp && storedOtp === otp;

const generateToken = (email) => jwt.sign({ email }, 'your-secret-key', { expiresIn: '1h' });

module.exports = { sendOTP, verifyOTP, generateToken };
