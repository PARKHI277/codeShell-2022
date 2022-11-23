require("dotenv").config();
const express = require("express");
const axios = require("axios");
const request = require("request");
const router = new express.Router();
const User = require("../models/Users");
const SendEmail = require("../services/email");
const { default: mongoose } = require("mongoose");
const Token = require("../models/token");
const crypto = require("crypto");

// async function validateHuman(token) {
//   const secret = process.env.SECRET_KEY;
//   console.log(secret);
//   console.log(token);
//   const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`;
//   request(verifyUrl, (err, response, body) => {
//     body = JSON.parse(body);

//     console.log(body.success);
//     return body.success;
//   });
// const response=await axios.post(
//   `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
//   {},
//   {
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
//     },
//   },
// ).then((res)=>{console.log(res.data);});
// const data = await response.data;
// console.log(response.data);
// console.log(response.data.success);
// return data.success;
// }

router.post("/register", async ({ body }, res) => {
  try {
    // const total= User.countDocuments({},(err,count)=>{
    //   if(err){console.log(err);}
    //   else
    //   console.log(count); }
    // );
    // console.log(total);
    const total_registration = await User.find().countDocuments();
    console.log(total_registration);
    if (total_registration > 500) {
      res.status(400).send({
        message: "Registration Full",
      });
    } else {
      const {
        name,
        email,
        studentNum,
        rollNum,
        mobileNum,
        year,
        branch,
        gender,
        hackerId,
        isHosteler,
      } = body;
      // if (token === undefined || token === "" || token === null)
      //   return res.status(200).send({ msg: "Token validation failed" });
      // const human = await validateHuman(token);
      // if (!human) {
      //   res.status(400);
      //   res.json({ errors: ["err"] });
      //   return;
      // }

      const userExist = await User.findOne({
        $or: [{ rollNum }, { mobileNum }, { email }, { studentNum }],
      });

      if (userExist) {
        return res.status(406).send({ msg: "User already exists" });
      }

      const userCreate = new User({
        name,
        email,
        studentNum,
        rollNum,
        mobileNum,
        year,
        branch,
        gender,
        hackerId,
        isHosteler,
      });

      const saveUser = await userCreate.save();
      let token = await new Token({
        userId: userCreate._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();

      const message = `${process.env.BASE_URL}/users/verify/${userCreate.id}/${token.token}`;
      console.log(message);

      SendEmail(saveUser.email, saveUser.name, message);
      res.status(201).send({
        message: "User Successfully Registered",
        id: saveUser._id,
      });
    }
  } catch (error) {
    res.status(400).send(`err ${error}`);
  }
});

router.get("/verify/:id/:token", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send("Invalid link");

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send("Invalid link");

    await User.updateOne({ _id: user._id, isVerified: true });
    await Token.findByIdAndRemove(token._id);

    res.send("email verified sucessfully");
  } catch (error) {
    res.status(400).send("An error occured");
  }
});

module.exports = router;
