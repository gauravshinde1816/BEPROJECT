const express = require("express");
const auth = require("../../middleware/auth");
const InvestmentModel = require("../../models/Investment.model");
const InvestorModel = require("../../models/Investor.model");
const StartupModel = require("../../models/Startup.model");

const router = express.Router();

router.get("/", async (req, res) => {
  const results = await InvestmentModel.find({});
  return res.json(results);
});

router.get("/investor", auth, async (req, res) => {
  const userId = req.user.id;
  let results = await InvestorModel.find({ userDetails: userId });
//   results = await Promise.all(
//     results.map(async (investment) => {
//       console.log("investment", investment);
//       const startup = await StartupModel.findById(investment.startup);
//       return {
//         startupName: startup.name,
//         amount: investment.amount,
//         valuation: startup.valuation,
//         logo: startup.image,
//         createdAt: investment.createdAt,
//         sector: startup.category,
//       };
//     })
//   );
  console.log(results);
  return res.json(results);
});

router.get("/:id", async (req, res) => {
  const investmentId = req.params.id;
  const results = await InvestmentModel.findById(investmentId);
  return res.json(results);
});

router.get("/startup/:startupId", async (req, res) => {
  const startupId = req.params.investorId;
  const results = await InvestorModel.find({ startup: startupId });
  return res.json(results);
});

module.exports = router;
