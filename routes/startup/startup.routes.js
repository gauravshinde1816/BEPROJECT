const express = require("express");
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

router.post("/", async (req, res) => {
  try {
    const { name, category, description, image, companySize, foundedIn } =
      req.body;

    let startup = new StartupModel({
      name,
      ideaPerson: "63e5e697b46f052b84a58475",
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
