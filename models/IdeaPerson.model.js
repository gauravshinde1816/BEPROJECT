const mongoose = require("mongoose");

const IdeaPersonSchema = new mongoose.Schema({
  userDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

module.exports = mongoose.model("idea_person", IdeaPersonSchema);
