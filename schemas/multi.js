const mongoose = require("mongoose");

const multi = mongoose.Schema({
  guildID: {
    type: String,
  },
  id: String,
  levellingDisabled: {
    type: String,
    default: "on",
  },
  multi: {
    type: Number,
    default: 1,
  },
});

module.exports = mongoose.model("multi", multi);

//Created by Shark#2538
