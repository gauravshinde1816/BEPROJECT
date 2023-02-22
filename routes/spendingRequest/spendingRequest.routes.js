const express = require("express");
const SpendingRequestModel = require("../../models/SpendingRequest.model");
const auth = require("../../middleware/auth");
const StartupModel = require("../../models/Startup.model");

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

router.get("/me", auth, async (req, res) => {
  try {
    const results = await SpendingRequestModel.find({
      ideaPersonID: req.user.id,
    });
    return res.status(200).json(results);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

router.get("/:spending_requestid", async (req, res) => {
  try {
    const id = req.params["spending_requestid"];
    const spending_request = await SpendingRequestModel.findById(id);
    if (!spending_request) {
      return res.status(400).json({ msg: "Spending Request not found" });
    }
    return res.status(200).json(spending_request);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

router.post("/:spending_requestid/upvote", auth, async (req, res) => {
  try {
    const id = req.params["spending_requestid"];
    const user = req.user.id;
    const spending_request = await SpendingRequestModel.findById(id);

    if (!spending_request) {
      return res.status(400).json({ msg: "Spending Request not found" });
    }

    let exists = spending_request.votes.find((v) => v.user.toString() === user);
    if (exists) {
      return res.status(400).json({ msg: "User has already voted" });
    }

    spending_request.votes.unshift({ user: user });
    await spending_request.save();

    return res.status(200).json(spending_request);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

router.put("/:spending_requestid/downvote", auth, async (req, res) => {
  try {
    const id = req.params["spending_requestid"];
    const user = req.user.id;
    const spending_request = await SpendingRequestModel.findById(id);

    if (!spending_request) {
      return res.status(400).json({ msg: "Spending Request not found" });
    }

    spending_request.votes = spending_request.votes.filter(
      (v) => v.user.toString() !== user
    );
    await spending_request.save();

    return res.status(200).json(spending_request);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

router.post("/:startupid", auth, async (req, res) => {
  try {
    const { title, amount, productDetails } = req.body;
    const startupID = req.params["startupid"];

    const spendingR = new SpendingRequestModel({
      title,
      amount,
      ideaPersonID: req.user.id,
      vendorID: "63e5ea6d6476252749e64beb",
      startup: startupID,
      productDetails,
    });

    await spendingR.save();

    const startup = await StartupModel.findById(startupID);

    if (!startup) {
      return res.status(400).json({ msg: "Start up does not exists" });
    }
    console.log(startup);

    startup.spendingRequest.push({ spendingRequestID: spendingR._id });
    await startup.save();

    return res.status(200).json(startup);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
