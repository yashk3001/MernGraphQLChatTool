// import mongoose from "mongoose";
const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    // username: {
    //   type: String,
    //   required: true,
    // },
    email: {
      type: String,
      required: true,
    },
    DOB: {
      type: Date,
    },
    gender: {
      type: String,
    },
    mobileNumber: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicUrl: {
      type: String,
    },
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    createdAt: {
      type: Date,
      default: Date.now, // Set the default value to the current date and time
    },
  },
  { timestamp: true }
);

const User = mongoose.model("User", userSchema);

// export default User;
module.exports = User;
