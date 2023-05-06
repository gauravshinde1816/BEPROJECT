const express = require("express");
const auth = require("../../middleware/auth");
const StartupModel = require("../../models/Startup.model");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const results = await StartupModel.find({});

    return res.json(results);
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error" });
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    const startup = await StartupModel.find({ ideaPerson: req.user.id });

    console.log(req.user.id);

    if (startup.length === 0) {
      return res.status(400).json({ msg: "No startup with Logged In User" });
    }
    return res.json(startup);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

router.get("/:startupid", async (req, res) => {
  try {
    const id = req.params["startupid"];
    const startup = await StartupModel.findById(id);
    if (!startup) {
      return res.status(400).json({ msg: "No startup with given ID" });
    }
    return res.json(startup);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      ideaPersonWalletAddress,
      image,
      companySize,
      foundedIn,
      valuation,
      ceo,
      country,
      headQuarters,
    } = req.body;
    console.log(req.user);
    let startup = new StartupModel({
      name,
      ideaPerson: req.user.id,
      category,
      description,
      image,
      companySize,
      ideaPersonWalletAddress,
      foundedIn,
      valuation,
      ceo,
      country,
      headQuarters,
    });

    await startup.save();

    console.log(startup);

    return res.status(200).json(startup);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
