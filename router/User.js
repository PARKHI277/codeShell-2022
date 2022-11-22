require("dotenv").config();
const express = require("express");
const axios = require("axios");
const router = new express.Router();
const User = require("../models/Users");
const SendEmail = require("../services/email");

async function validateHuman(token) {
  const secret = process.env.SECRET_KEY;
  const response=await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
    {},
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
      },
    },
  );
  const data = await response.data;
  return data.success;
}

router.post("/register", async ({ body }, res) => {
  try {
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
      token
    } = body;
    if( token === undefined ||token==="" || token===null)
return res.status(200).send({"msg":"Token validation failed"});
const human = await validateHuman(token);
if (!human) {
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
      token
    });

    const saveUser = await userCreate.save();

    SendEmail(saveUser.email, saveUser.name);
    res.status(201).send({
      message: "User Successfully Registered",
      id: saveUser._id,
    });
  } catch (error) {
    res.status(400).send(`err ${error}`);
  }
});

module.exports = router;
