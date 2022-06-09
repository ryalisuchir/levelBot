const mongoose = require("mongoose");

const overallEconomy = mongoose.Schema({
  userID: {
    type: String,
  },
  guildID: {
    type: String,
  },
  coins: {
    type: Number,
    default: 500,
  },
  bank: {
    type: Number,
    default: 0,
  },
  maxBank: {
    type: Number,
    default: 1500,
  },
  Statistics: {
    XP: { type: Number, default: 0 },
    Level: { type: Number, default: 1 },
    CommandsUsed: { type: Array, default: [] },
    RegisteredAt: { type: Number, default: Date.now() },
  },
  //daily
  lastDaily: {
    type: String,
    default: parseFloat(Date.now()),
  },
  dailyMessages: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("overallEconomy", overallEconomy);

//Created by Shark#2538
