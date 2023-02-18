const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("config");
var bcrypt = require("bcryptjs");
const UserModel = require("../../models/User.model");
const InvestorModel = require("../../models/Investor.model");
const IdeaPersonModel = require("../../models/IdeaPerson.model");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await UserModel.find({});
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internel server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, age, password, address, interests, role, email } = req.body;

    let user = await UserModel.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    var salt = bcrypt.genSaltSync(10);
    hashpassword = bcrypt.hashSync(password, salt);

    user = new UserModel({
      name,
      age,
      password : hashpassword,
      address,
      interests,
      role,
      email,
    });

    // if user is investor
    if (role == "INVESTOR") {
      let investor = new InvestorModel({
        userDetails: user._id,
      });
      await investor.save();
    }

    // if user is IDEAPERSON
    if (role == "IDEAPERSON") {
      let ideaPerson = new IdeaPersonModel({
        userDetails: user._id,
      });
      await ideaPerson.save();
    }

    await user.save();

    const payload = {
      user: {
        id: user._id,
      },
    };

    jwt.sign(payload, config.get("SECRET"), (error, token) => {
      if (error) {
        return res.status(400).json({ msg: "Invalid token signing" });
      } else {
        return res.json({ token });
      }
    });
  } catch (error) {
    return res.status(500).json({ msg: " Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User does not exists in DB" });
    }

    let isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ msg: "UserName or Password does not match" });
    }

    const payload = {
      user: {
        id: user._id,
      },
    };

    jwt.sign(payload, config.get("SECRET"), (err, token) => {
      if (err) return res.status(400).json({ msg: " Error in signing token" });
      else {
        return res.json({ token });
      }
    });
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ msg: " Internal server error" });
  }
});

module.exports = router;
