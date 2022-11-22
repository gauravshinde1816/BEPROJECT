const mongoose = require("mongoose");

const InvestmentModel = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId
    },
    startup: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "startup",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("investment", InvestmentModel);
