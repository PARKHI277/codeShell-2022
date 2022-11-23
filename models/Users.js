require("dotenv").config();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: { type: String, required: [true, "Name is required"], minlength: 2 },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    studentNum: {
      type: Number,
      required: [true, "Student Number is required"],
      unique: true,
      maxLength: [8, "max length is 8"],
    },
    rollNum: {
      type: Number,
      required: [true, "Roll Number is required"],
      unique: true,
      minLength: [13, "min length is 13"],
      maxLength: [13, "max length is 13"]
    },
    mobileNum: {
      type: Number,
      required: [true, "Mobile Number is required"],
      maxLength: 10,
      minLength: 10,
      unique: true,
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
      min: 1,
      max: 4,
    },
    branch: {
      type: String,
      required: [true, "Year is required"],
    },

    gender: {
      type: String,
      required: [true, "Gender is required"],
    },
    isHosteler: {
      type: Boolean,
      default: false,
      required: true,
    },
    hackerId: {
      type: String
    },
   captcha_token: {
      type: String},
    isVerified: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

const User = new mongoose.model("User", UserSchema);
module.exports = User;
