require("dotenv").config();
const express = require("express");
const axios = require("axios");
const request = require("request");
const router = new express.Router();
const User = require("../models/Users");
const SendEmail = require("../services/email");
const { default: mongoose } = require("mongoose");

// const validateHuman = async (captcha_token) => {try{
//   const secret = process.env.SECRET_KEY;
//   console.log(secret);
//   console.log(captcha_token);
//   const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${captcha_token}`;
//   request(verifyUrl, (err, response, body) => {
//     body = JSON.parse(body);
//     console.log(body.success);
//     return body.success;
//   });
  // let data;
  // const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${captcha_token}`
  // axios.post(
  //   url
  // ).then((res) => {
  //   console.log(res);
  //   // data = res.data
  // })
  //   .catch((err) => console.log(err));
  // // const data = await response.data;
  // // console.log(response.data);
  // // console.log(response.data.success);
  // return true;
//}
// catch (error) {console.log(err);
// }}

router.post("/register", async ({ body }, res) => {
  try {
    // const total= User.countDocuments({},(err,count)=>{
    //   if(err){console.log(err);}
    //   else
    //   console.log(count); }
    // );
    // console.log(total);
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
      captcha_token
    } = body;
    if (!captcha_token)
      return res.status(200).send({ "msg": "captcha_token validation failed" });
      const secret = process.env.SECRET_KEY;
  console.log(secret);
  console.log(captcha_token);
  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${captcha_token}`;
  request(verifyUrl,async (err, response, body) => {
    body = JSON.parse(body);
    console.log(body.success);
   
    if (!body.success) {
      res.status(400);
      res.json({ errors: ["err"] });
      return;
    }

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
      captcha_token
    });

    const saveUser = await userCreate.save();

    SendEmail(saveUser.email, saveUser.name);
    res.status(201).send({
      message: "User Successfully Registered",
      id: saveUser._id,
    });
  });
  } catch (error) {
    res.status(400).send(`err ${error}`);
  }
});

module.exports = router;
