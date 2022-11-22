const express = require("express");
var bcrypt = require("bcryptjs");
const UserModel = require("../../models/User.model");
const InvestorModel = require("../../models/Investor.model");
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

    console.log(user);

    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    var salt = bcrypt.genSaltSync(10);
    hashpassword = bcrypt.hashSync(password, salt);

    user = new UserModel({
      name,
      age,
      hashpassword,
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

    await user.save();

    return res.status(200).json({ user });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({ msg: " Internal server error" });
  }
});

module.exports = router;
