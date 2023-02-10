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
    ideaPersonID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "idea_person",
    },
    vendorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vendor",
    },
    amount: {
      type: Number,
      required: true,
    },

    totalAmountRaised: {
      type: Number,
    },

    productDetails: {
      type: String,
      required: true,
    },
    expiryTime: {
      type: Date,
      default: minuteFromNow,
    },
    isApproved: {
      type: Boolean,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
    startup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "startup",
    },
    votes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("spending_request", SpendingRequest);
