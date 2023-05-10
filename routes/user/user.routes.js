const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/auth");
const UserModel = require("../../models/User.model");
const InvestorModel = require("../../models/Investor.model");
const IdeaPersonModel = require("../../models/IdeaPerson.model");
const VendorModel = require("../../models/Vendor.model");
const AdminModel = require("../../models/Admin.model");
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

router.get("/profile", auth, async (req, res) => {
  try {
    let response = {};
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(400).json({ msg: "User Not found" });
    }
    response.user = user;

    if (user.role === "INVESTOR") {
      const investorDetails = await InvestorModel.findOne({
        userDetails: req.user.id,
      });

      if (!investorDetails) {
        return res
          .status(400)
          .json({ msg: " investorDetails Does not exists" });
      }

      response.userType = "INVESTOR";
      response.details = investorDetails;
    } else if (user.role === "IDEAPERSON") {
      const ideapersonDetails = await IdeaPersonModel.findOne({
        userDetails: req.user.id,
      });

      if (!ideapersonDetails) {
        return res
          .status(400)
          .json({ msg: " ideapersonDetails Does not exists" });
      }

      response.userType = "IDEAPERSON";
      response.details = ideapersonDetails;
    } else if (user.role === "VENDOR") {
      const vendorDetails = await VendorModel.findOne({
        userDetails: req.user.id,
      });
      if (!vendorDetails) {
        return res.status(400).json({ msg: " vendorDetails Does not exists" });
      }

      response.userType = "VENDOR";
      response.details = vendorDetails;
    } else {
      const adminDetails = await AdminModel.findOne({
        userDetails: req.user.id,
      });
      if (!adminDetails) {
        return res.status(400).json({ msg: " adminDetails Does not exists" });
      }

      response.userType = "ADMIN";
      response.details = adminDetails;
    }

    return res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, age, password, address, interests, role, email , walletAddress} = req.body;

    let user = await UserModel.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    var salt = bcrypt.genSaltSync(10);
    hashpassword = bcrypt.hashSync(password, salt);

    user = new UserModel({
      name,
      age,
      password: hashpassword,
      address,
      interests,
      role,
      email,
      walletAddress,
    });

    await user.save();
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

    // if user is VENDOR
    if (role == "VENDOR") {
      const vendor = new VendorModel({
        userDetails: user._id,
      });
      await vendor.save();
    }

    // if user is ADMIN
    if (role == "ADMIN") {
      const admin = new AdminModel({
        userDetails: user._id,
      });
      await admin.save();
    }

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
    console.log(error.message);
    return res.status(500).json({ msg: " Internal server error" });
  }
});

module.exports = router;
