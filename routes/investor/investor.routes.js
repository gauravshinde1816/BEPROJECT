const express = require("express");
const Web3 = require("web3");
const EthereumTransaction = require("ethereumjs-tx").Transaction;
const web3 = new Web3("http://127.0.0.1:7545");
const InvestmentModel = require("../../models/Investment.model");
const InvestorModel = require("../../models/Investor.model");
const SpendingRequestModel = require("../../models/SpendingRequest.model");
const StartupModel = require("../../models/Startup.model");
const auth = require("../../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const results = await InvestorModel.find({}).populate("userDetails");
    return res.status(200).json(results);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

const getSpendingRequests = async (id) => {
  const sp = await SpendingRequestModel.findOne({ startup: id });
  return sp;
};

router.get("/getspendingrequest", auth, async (req, res) => {
  try {
    let investor = await InvestorModel.findOne({ userDetails: req.user.id });
    const startups = investor.investments;
    console.log(startups);
    let spendingRequest = [];
    let startupIDs = [];
    startups.map((s) => startupIDs.push(s.startupID));
    startupIDs.map((st) => {
      const sp = getSpendingRequests(st.startupID);
      spendingRequest.push(sp);
    });
    return res.json(spendingRequest);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: "internal server error" });
  }
});

router.get("/:investor_id", async (req, res) => {
  try {
    const id = req.params["investor_id"];
    const investor = await InvestorModel.findById(id);

    if (!investor) {
      return res.status(400).json({ msg: "No investor with given ID" });
    }
    return res.status(200).json({ investor });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

const sendTransaction = async (amount) => {
  var sendingAddress = "0x05afd468E415C721D516b103B5EF9748203141Be";
  var receivingAddress = "0x7cF8b8901e5fE65B0dcDdC49c4c6663DDd578e6d";

  web3.eth.getBalance(sendingAddress).then(console.log);

  web3.eth.getBalance(receivingAddress).then(console.log);

  const nonce = await web3.eth.getTransactionCount(sendingAddress);

  var rawTransaction = {
    nonce: nonce,
    to: receivingAddress,
    gasPrice: 2,
    gasLimit: 30000,
    value: 1,
    data: "0x",
  };

  var privateKeySender =
    "64eaf1efa7dfc4b3f6a1f69a480e9785d90076cd8522373fcd4a57eb4c6a6cfd";
  var privateKeySenderHex = new Buffer.alloc(32, privateKeySender, "hex");
  var transaction = new EthereumTransaction(rawTransaction);
  transaction.sign(privateKeySenderHex);

  var serializedTransaction = transaction.serialize();
  web3.eth.sendSignedTransaction(serializedTransaction);
};

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
        vendorAddress: "0x7cF8b8901e5fE65B0dcDdC49c4c6663DDd578e6d",
        investorAddress: "0x05afd468E415C721D516b103B5EF9748203141Be",
      });

      await investment.save();

      let exists = investor.investments.find(
        (i) => i.startupID.toString() === startupID
      );
      if (!exists) {
        investor.investments.unshift({ startupID: startup._id });
        await investor.save();
      }

      spending_request.amount = spending_request.amount - amount;
      if (spending_request.amount - amount <= 0) {
        spending_request.isOpen = false;
      }
      await spending_request.save();

      //
      sendTransaction(amount);

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

/*
63ed23ecc3f9033081e4b077
63ed23ecc3f9033081e4b079
*/

module.exports = router;
