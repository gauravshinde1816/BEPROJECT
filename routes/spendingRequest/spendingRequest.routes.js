const express = require("express");
const SpendingRequestModel = require("../../models/SpendingRequest.model");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const results = await SpendingRequestModel.find({});
    return res.status(200).json(results);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, amount, productDetails, expiryDate } = req.body;

    const spendingRequest = new SpendingRequestModel({
      title,
      amount,
      productDetails,
      expiryDate,
    });

    await spendingRequest.save();
    return res.status(200).json(spendingRequest);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
