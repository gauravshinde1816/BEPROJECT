const express = require("express");
const Web3 = require("web3");
const EthereumTransaction = require("ethereumjs-tx").Transaction;
const web3 = new Web3("http://127.0.0.1:7545");
const InvestmentModel = require("../../models/Investment.model");
const InvestorModel = require("../../models/Investor.model");
const SpendingRequestModel = require("../../models/SpendingRequest.model");
const StartupModel = require("../../models/Startup.model");
const auth = require("../../middleware/auth");
const UserModel = require("../../models/User.model");

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
  var sendingAddress = "0xfe767676C7FF81e3DE2bFAeda06B08d5D8c99cf2";
  var receivingAddress = "0x7C23A3a58177e1De920c08576A53e389b91cef8A";

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
    "73f566c529bc4558b6f89a5a67958482c97eae7759a39dbf20d9399a81c8f250";
  var privateKeySenderHex = new Buffer.alloc(32, privateKeySender, "hex");
  var transaction = new EthereumTransaction(rawTransaction);
  transaction.sign(privateKeySenderHex);

  var serializedTransaction = transaction.serialize();
  web3.eth.sendSignedTransaction(serializedTransaction);

  console.log("After Tx");

  web3.eth.getBalance(sendingAddress).then(console.log);
  web3.eth.getBalance(receivingAddress).then(console.log);
};

router.post("/invest/:startup/:spending_request", auth, async (req, res) => {
  let investorID = req.user.id;
  let startupID = req.params["startup"];
  let spending_requestID = req.params["spending_request"];

  try {
    const { amount } = req.body;

    let user = await UserModel.findById(investorID);
    let investor = await InvestorModel.findOne({ userDetails: user._id });
    let startup = await StartupModel.findById(startupID);
    let spending_request = await SpendingRequestModel.findById(
      spending_requestID
    );

    console.log(user?._id,  startup?._id, spending_request?._id);
    // let investment = new InvestmentModel({
    //   amount,
    //   user: investor._id,
    //   startup: startup._id,
    //   vendorAddress: "0xfe767676C7FF81e3DE2bFAeda06B08d5D8c99cf2",
    //   investorAddress: "0x7C23A3a58177e1De920c08576A53e389b91cef8A",
    // });
    // await investment.save();

    // let exists = investor.investments.find(
    //   (i) => i.startupID.toString() === startupID
    // );
    // if (!exists) {
    //   investor.investments.unshift({ startupID: startup._id });
    //   await investor.save();
    // }

    spending_request.totalAmountRaised = spending_request.totalAmountRaised  + amount;
    if (spending_request.amount - spending_request.totalAmountRaised <= 0) {
      spending_request.isOpen = false;
    }
    await spending_request.save();

    //
    // sendTransaction(amount);

    return res.json({
      startup: startup,
      spending_request: spending_request,
      
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: "internal server error" });
  }
});

/*
63ed23ecc3f9033081e4b077
63ed23ecc3f9033081e4b079
*/

module.exports = router;
