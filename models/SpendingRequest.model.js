const mongoose = require("mongoose");

var minuteFromNow = function () {
  var timeObject = new Date();
  timeObject.setTime(timeObject.getTime() + 1000 * 60);
  return timeObject;
};

const SpendingRequest = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },

    productDetails: {
      type: String,
      required: true,
    },
    expiryTime: {
      type: Date,
      default: minuteFromNow,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
    startup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "startup",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("spending_request", SpendingRequest);
