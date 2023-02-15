const mongoose = require("mongoose");
const StartupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  ideaPerson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "idea_people",
  },
  category: {
    type: String,
    // enum: ["EDTECH", "FINTECH", "LIFESTYLE", "SOCIAL"],
  },
  spendingRequest: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "spending_request",
    },
  ],
  description: {
    type: String,
    default: "",
  },
  companySize: {
    type: String,
  },
  foundedIn: {
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
