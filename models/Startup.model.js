const mongoose = require("mongoose");
const StartupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  }, 
  category: {
    type: String,
    enum: ["EDTECH", "FINTECH", "LIFESTYLE", "SOCIAL"],
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
});

module.exports = mongoose.model("Startup", StartupSchema);
