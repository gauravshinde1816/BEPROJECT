const express = require("express");
const SpendingRequestModel = require("../../models/SpendingRequest.model");
const InvestorModel = require("../../models/Investor.model");
const auth = require("../../middleware/auth");
const StartupModel = require("../../models/Startup.model");
const UserModel = require("../../models/User.model");
const IdeaPersonModel = require("../../models/IdeaPerson.model");
const InvestmentModel = require("../../models/Investment.model");
const VendorModel = require("../../models/Vendor.model");

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

router.get("/byInvestor", auth, async (req, res) => {
  const userId = req.user.id;
  let investor = await InvestorModel.findOne({ userDetails: userId });
  let investments = await InvestmentModel.find({ investorId: investor._id });

  console.log("Investment : ", investments);

  const startupIdsObject = {};

  investments.forEach((investment) => {
    startupIdsObject[investment.startup] = 0;
  });

  const startupIds = Object.keys(startupIdsObject);

  console.log("ST ids : ", startupIds);
  let srs = [];

  await Promise.all(
    startupIds.map(async (startupId) => {
      const sr = await SpendingRequestModel.find({ startup: startupId });
      sr.forEach((ele) => {
        srs.push(ele);
      });
    })
  );

  const results =  srs.map((ele, id) => {
     
      return {
        srNo: id + 1,
        title : ele.title,
        amount : ele.amount,
        productDetails : ele?.productDetails,
        totalAmountRaised: ele?.totalAmountRaised,
        approvals: ele?.votes?.length,
        createdAt: ele?.createdAt,
      };
    })


  console.log("results: ", results);
  return res.send(results);
});

router.get("/byStartup/:startupId", async (req, res) => {
  try {
    const { startupId } = req.params;
    const results = await SpendingRequestModel.find({ startup: startupId });
    return res.status(200).json(results);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    let results = await SpendingRequestModel.find({
      ideaPersonID: req.user.id,
    });

    console.log(results);

    results = await Promise.all(
      results.map(async (ele) => {
        const startup = await StartupModel.findById(ele.startup);
        const user = await UserModel.findById(ele.ideaPersonID);
        console.log(startup);

        return {
          sr: ele,
          title: ele.title,
          productDetails: ele.productDetails,
          amount: ele.amount,
          totalAmountRaised: ele.totalAmountRaised,
          createdAt: ele.createdAt,
          name: startup.name,
          cmname: user.name,
        };
      })
    );

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
    const { title, amount, productDetails, vendorWalletAddress } = req.body;
    const startupID = req.params["startupid"];

    const spendingR = new SpendingRequestModel({
      title,
      amount,
      ideaPersonID: req.user.id,
      vendorWalletAddress,
      vendorID: "63e5ea6d6476252749e64beb",
      startup: startupID,
      productDetails,
    });

    await spendingR.save();

    const startup = await StartupModel.findById(startupID);

    if (!startup) {
      return res.status(400).json({ msg: "Start up does not exists" });
    }

    startup.spendingRequest.push({ spendingRequestID: spendingR._id });
    await startup.save();

    return res.status(200).json(spendingR._id);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
