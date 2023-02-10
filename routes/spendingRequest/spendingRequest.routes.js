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
      ideaPersonID: "63e5e697b46f052b84a58475",
      vendorID: "63e5ea6d6476252749e64beb",
      startup:"63e5e94fd4696f0a549c6651",
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
