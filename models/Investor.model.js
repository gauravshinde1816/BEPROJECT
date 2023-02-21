const mongoose = require("mongoose");

const InvestorSchema = new mongoose.Schema(
  {
    userDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    investmentfirmDetails: {
      type: String,
    },
    investments: [
      {
        startupID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "startup",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("investor", InvestorSchema);
