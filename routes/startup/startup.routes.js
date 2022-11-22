const express = require("express");
const StartupModel = require("../../models/Startup.model");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, category, description, image } = req.body;

    let startup = new StartupModel({
      name,
      category,
      description,
      image,
    });

    await startup.save();
    return res.status(200).json(startup);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
