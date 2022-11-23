require("dotenv").config();
const express = require("express");
const axios = require("axios");
const request = require("request");
const router = new express.Router();
const User = require("../models/Users");
const SendEmail = require("../services/email");
const { default: mongoose } = require("mongoose");
const crypto = require("crypto");
const Token = require("../models/token");

router.post("/register", async ({ body }, res) => {
  try { const total_registration = await User.find().countDocuments();
    console.log(total_registration);
    if (total_registration > 500) {
      res.status(400).send({
        message: "Registration Full"
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
        captcha_token
      } = body;
     
  if (!captcha_token)
      return res.status(200).send({ "msg": "captcha_token validation failed" });
      const secret = process.env.SECRET_KEY;
  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${captcha_token}`;
  request(verifyUrl,async (err, response, body) => {
    body = JSON.parse(body);
    console.log(body.success);
   
    if (!body.success) {
      res.status(403);
      res.json({ errors: ["err"] });
      return;
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
   // generating token
   let token = await new Token({
    userId: userCreate._id,
    token: crypto.randomBytes(32).toString("hex"),
  }).save();

  const message = `${process.env.BASE_URL}/users/verify/${userCreate.id}/${token.token}`;
  console.log(message);
    const saveUser = await userCreate.save();

    SendEmail(saveUser.email, saveUser.name);
    res.status(201).send({
      message: "User Successfully Registered",
      id: saveUser._id,
    });
  });}
  } catch (error) {
    res.status(400).send(`err ${error}`);
  }
});

router.get("/verify/:id/:token", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    console.log(user);
    if (!user) return res.status(400).send("Invalid link");

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    console.log(token);
    if (!token) return res.status(400).send("Invalid link");

    await User.findByIdAndUpdate(user._id, {
      $set: {
        isVerified: true,
      },
    });

    await Token.findByIdAndRemove(token._id);

    res.send("Email verified sucessfully");
  } catch (error) {
    console.log(error);
    res.status(400).send("An error occured");
  }
});

module.exports = router;
