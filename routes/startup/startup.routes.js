const express = require("express");
const auth = require("../../middleware/auth")
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

router.get("/:startupid", auth, async (req, res) => {
  try {
    const id = req.params["startupid"];
    const userID = req.user;
    const startup = await StartupModel.find({ $and: [{ _id: id }, {}] });
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
    const { name, category, description, image, companySize, foundedIn } =
      req.body;
    console.log(req.user)
    let startup = new StartupModel({
      name,
      user: req.user.id,
      category,
      description,
      image,
      companySize,
      foundedIn,
    });

    await startup.save();
    return res.status(200).json(startup);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
