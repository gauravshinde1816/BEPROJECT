const mongoose = require("mongoose");

const VendorModel = new mongoose.Schema(
  {
    userDetails: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    spendingRequest: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "spending_request",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("vendor", VendorModel);
