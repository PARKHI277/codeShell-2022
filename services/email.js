require("dotenv").config();
const nodemailer = require("nodemailer");

const sendEmail = function sendEmail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.AUTHEREMAIL,
      pass: process.env.AUTHERPASS,
    },
  });

  const mailOptions = {
    from: process.env.AUTHEREMAIL,
    to: to,
    subject: "CodeShell Registration",
    text: `Team CSI congratulates you on successfully registering for CODESHELL 3.0. Get ready to experience enthusiasm at full throttle and show your coding skills among others at this exciting event.
Mode:- Offline
Date:- 24th November, 2022
Time:- 4pm - 6pm
Venue:- IT Labs
For more information, stay tuned on our Instagram page.
https://www.instagram.com/csi_akgec/
Regards,
Team CSI`,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("OTP sent");
    }
  });
};
module.exports = sendEmail;
