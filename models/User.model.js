const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    password: {
      type: String,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    interests: {
      type: String,
    },
    role: {
      type: String,
      enum: ["INVESTOR", "IDEAPERSON", "VENDOR"],
    },
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("user", UserSchema);
