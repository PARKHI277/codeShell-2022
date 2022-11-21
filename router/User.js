require("dotenv").config();
const express = require("express");

const router = new express.Router();
const User = require("../models/Users");
const SendEmail = require("../services/email");
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
    } = body;
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

    SendEmail(saveUser.email);
    res.status(201).send({
      message: "User Successfully Registered",
      id: saveUser._id,
    });
  } catch (error) {
    res.status(400).send(`err ${error}`);
  }
});

module.exports = router;
