// ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬[ Start ]▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
process.traceDeprecation = true;
const express = require("express");
const app = express();
const chalk = require("chalk");
const mongoose = require("mongoose");
const path = require("path");

// ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬[ Website ]▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
app.use(express.static(__dirname));
app.get("/", (req, res) => {
  res.send("Bot is online.");
});
app.listen(3000, () => {
  console.log(
    chalk.white("["),
    chalk.cyan("Express"),
    chalk.white("]"),
    chalk.gray(":"),
    chalk.white("Connected")
  );
});

// ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬[ Client ]▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
const {
  Client,
  Collection,
  Intents,
  WebhookClient,
  MessageButton,
  MessageActionRow,
  MessageEmbed,
} = require("discord.js");
const client = new Client({
  intents: 32767,
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

mongoose.connect(`${process.env["MONGO_URI"]}`, { useNewUrlParser: true });
const mongoDB = mongoose.connection;
mongoDB.on(
  "error",
  console.error.bind(console, "[ ConnectionError via Mongo ]")
);
mongoDB.once("open", function () {
  console.log(
    chalk.white("[ "),
    chalk.red.bold("Database"),
    chalk.white(" ]"),
    chalk.gray(":"),
    chalk.white(`Connected to MongoDB.`)
  );
  //Connected to MongoDB!!
});

module.exports = client;

// ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬[ Global Variables ]▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
const scripts = require("./BotConfiguration/scripts");
client.commands = new Collection();
client.events = new Collection();
client.aliases = new Collection();
client.cooldowns = new Collection();
client.slashCommands = new Collection();
client.functions = {
  getRandom: scripts.getRandom,
  sleep: scripts.sleep,
  percentage: scripts.percentage,
  findUser: scripts.findUser,
  forceUpdate: scripts.forceUpdate,
  addXP: scripts.addXP,
  formatTime: scripts.formatTime,
  addCoins: scripts.addCoins,
  giveReward: scripts.giveReward,
};

const Timeout = new Collection();
client.snipes = {
  snipes: new Collection(),
  esnipes: new Collection(),
};
client.config = require("./BotConfiguration/settings.json");
require("./Handler")(client);

// ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬[ AntiCrash ]▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

process.on("unhandledRejection", (reason, p) => {
  console.log(chalk.gray("—————————————————————————————————"));
  console.log(
    chalk.white("["),
    chalk.red.bold("AntiCrash"),
    chalk.white("]"),
    chalk.gray(" : "),
    chalk.white.bold("Unhandled Rejection/Catch")
  );
  console.log(chalk.gray("—————————————————————————————————"));
  console.log(reason, p);
});
process.on("uncaughtException", (err, origin) => {
  console.log(chalk.gray("—————————————————————————————————"));
  console.log(
    chalk.white("["),
    chalk.red.bold("AntiCrash"),
    chalk.white("]"),
    chalk.gray(" : "),
    chalk.white.bold("Uncaught Exception/Catch")
  );
  console.log(chalk.gray("—————————————————————————————————"));
  console.log(err, origin);
});
process.on("multipleResolves", (type, promise, reason) => {
  console.log(chalk.gray("—————————————————————————————————"));
  console.log(
    chalk.white("["),
    chalk.red.bold("AntiCrash"),
    chalk.white("]"),
    chalk.gray(" : "),
    chalk.white.bold("Multiple Resolves")
  );
  console.log(chalk.gray("—————————————————————————————————"));
  console.log(type, promise, reason);
});

const token = process.env["TOKEN"];
client.login(token);

//Created by Shark#2538
