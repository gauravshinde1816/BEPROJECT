const mongoose = require("mongoose");
const StartupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["EDTECH", "FINTECH", "LIFESTYLE", "SOCIAL"],
  },
  //   totalInvestMent: {
  //     typr: Number,
  //     default: 0,
  //   },
  //   totalInvestMentRounds: {
  //     type: Number,
  //     default: 0,
  //   },

  investments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "investment",
    },
  ],
  description: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Startup", StartupSchema);
