const express = require("express");
const InvestmentModel = require("../../models/Investment.model");
const InvestorModel = require("../../models/Investor.model");
const SpendingRequestModel = require("../../models/SpendingRequest.model");
const StartupModel = require("../../models/Startup.model");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const results = await InvestorModel.find({});
    return res.status(200).json(results);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

router.get("/:investor_id", async (req, res) => {
  try {
    const id = req.params["investor_id"];
    const investor = await InvestorModel.findById(id);

    if (!investor) {
      return res.status(400).json({ msg: "No investor with given ID" });
    }
    return res.status(200).json({investor});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

router.post(
  "/invest/:investor/:startup/:spending_request",
  async (req, res) => {
    let investorID = req.params["investor"];
    let startupID = req.params["startup"];
    let spending_requestID = req.params["spending_request"];

    try {
      const { amount } = req.body;

      let investor = await InvestorModel.findById(investorID);
      let startup = await StartupModel.findById(startupID);
      let spending_request = await SpendingRequestModel.findById(
        spending_requestID
      );

      console.log(investor);
      console.log(startup);
      console.log(spending_request);

      let investment = new InvestmentModel({
        amount,
        user: investor._id,
        startup: startup._id,
      });

      await investment.save();

      startup.investments.unshift(investment._id);
      await startup.save();

      investor.investments.unshift(startup._id);
      await investor.save();

      spending_request.amount = spending_request.amount - amount;
      if (spending_request.amount - amount <= 0) {
        spending_request.isOpen = false;
      }
      await spending_request.save();

      return res.json({
        startup: startup,
        investment: investment,
        spending_request: spending_request,
        investor: investor,
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ msg: "internal server error" });
    }
  }
);

module.exports = router;
