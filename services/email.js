require("dotenv").config();
const nodemailer = require("nodemailer");

const sendEmail = function sendEmail(to, username) {
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
    subject: "CodeShell 3.0 Registration",
    html: `<img src="cid:unique@kreata.ee"/><p>Greetings ${username}, <br><br><b>Team CSI</b> congratulates you on successfully registering for CODESHELL 3.0. Get ready to experience enthusiasm at full throttle and show your coding skills among others at this exciting event.<br><br><b>Mode:- Offline<br>Date:- 24th November, 2022<br>Time:- 4pm onwards<br>Venue:- IT Labs</b><br><br>For more information, stay tuned on our Instagram page.<br>https://www.instagram.com/csi_akgec/<br><br>Regards,<br>Team CSI</p>`,
    attachments: [{
      filname: "codeshell3.0.jpeg",
      path: "./codeshell3.0.jpeg",
        cid: 'unique@kreata.ee'}
    ]
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
