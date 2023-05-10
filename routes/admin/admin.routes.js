const express = require("express");
const auth = require("../../middleware/auth");
const InvestmentModel = require("../../models/Investment.model");
const InvestorModel = require("../../models/Investor.model");
const StartupModel = require("../../models/Startup.model");

const router = express.Router();

const Admin = require("../../models/Admin.model");
const SpendingRequestModel = require("../../models/SpendingRequest.model");

// get all admins
router.get("/", async (req, res) => {
  const admins = await Admin.find({});
  res.json(admins);
});

// get all admins
router.get("/spending-requests", async (req, res) => {
  const allStartups = await StartupModel.find({});
  const requiredStartups = allStartups
    .filter(async (startup) => {
      const investmentCount = await InvestmentModel.countDocuments({
        startup: startup._id,
      });

      return investmentCount === 0;
    })
    .map((startup) => startup);

  const spendingRequests = [];

  await Promise.all(
    requiredStartups.map(async (startup) => {
      const spendingRequestResults = await SpendingRequestModel.find({
        startup: startup._id,
      });
      spendingRequestResults.map((sr) => {
        spendingRequests.push(sr);
      });
    })
  );

  res.send(spendingRequests);
});

module.exports = router;
