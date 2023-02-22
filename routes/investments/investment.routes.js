const express = require("express");
const InvestmentModel = require("../../models/Investment.model");
const InvestorModel = require("../../models/Investor.model");

const router = express.Router();

router.get("/", async (req, res) => {
  const results = await InvestmentModel.find({});
  return res.json(results);
});

router.get("/:id", async (req, res) => {
  const investmentId = req.params.id;
  const results = await InvestmentModel.findById(investmentId);
  return res.json(results);
});

router.get("/investor/:investorId", async (req, res) => {
  const investorId = req.params.investorId;
  const results = await InvestorModel.find({ user: investorId });
  return res.json(results);
});

router.get("/startup/:startupId", async (req, res) => {
  const startupId = req.params.investorId;
  const results = await InvestorModel.find({ startup: startupId });
  return res.json(results);
});

module.exports = router;
