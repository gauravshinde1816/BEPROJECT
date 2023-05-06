// "spendingRequest": [],
// "description": "Contact Radiation of Pleura",
// "image": "http://dummyimage.com/189x100.png/cc0000/ffffff",
// "_id": "63ed23ecc3f9033081e4b077",
// "name": "Voolia",
// "ideaPerson": "Dion",
// "category": "Finance",
// "gender": "Female",
// "companySize": "5338",
// "foundedIn": "2004",
// "valuation": "786",
// "ceo": "Dion Dahmke",
// "country": "Brazil",
// "headQuarters": "Salto",
// "__v": 2

const mongoose = require("mongoose");
const StartupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  ideaPerson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  ideaPersonWalletAddress :{
    type: String,
  },
  gender: {
    type: String,
  },
  category: {
    type: String,
    enum: ["EDTECH", "FINTECH", "LIFESTYLE", "SOCIAL", "Finance" , "n/a"],
  },
  spendingRequest: [
    {
      spendingRequestID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "spending_request",
      },
    },
  ],
  description: {
    type: String,
    default: "",
  },
  companySize: {
    type: String,
  },
  ceo: {
    type: String,
  },
  foundedIn: {
    type: String,
  },
  valuation: {
    type: Number,
  },
  country: {
    type: String,
  },
  headQuarters: {
    type: String,
  },
  image: {
    type: String,
    default: "",
  },
  valuation: {
    type: String,
  },
  ceo: {
    type: String,
  },
  country: {
    type: String,
  },
  headQuarters: {
    type: String,
  },
});

module.exports = mongoose.model("Startup", StartupSchema);
