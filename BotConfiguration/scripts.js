const database = require("mongoose");
const userSchema = require("../schemas/leveling");
const client = require("../index");
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const percentage = (percent, total) => {
  return parseInt(
    Math.floor((100 * parseInt(percent)) / parseInt(total)).toFixed(2)
  );
};

const findUser = async (message, userID, guildID) => {
  if (!userID) return console.log("Provide a valid userID.");

  const user = await userSchema.findOne({ userID: userID, guildID: guildID });
  if (!user) {
    const newUser = new userSchema({ userID: userID, guildID: guildID });
    const overallEmbed = new MessageEmbed()
      .setDescription(
        `<:arrow_right:961073009106485299> Thanks for using communityBot in ${message.guild.name}. \n <:arrow_right:961073009106485299> Use the command \`sb help\` to get started.`
      )
      .setFooter({ text: "You have officially been added to the database." })
      .setColor("303136");

    const mainButton = new MessageButton()
      .setStyle("SECONDARY")
      .setLabel("Welcome to communityBot")
      .setCustomId("welcomeButton")
      .setDisabled(true);

    const newRow = new MessageActionRow().addComponents(mainButton);

    delete newUser.userID;

    await newUser
      .save()
      .catch((error) => console.log("Catched error: " + error));
    message.reply({
      embeds: [overallEmbed],
      components: [newRow],
    });
    return newUser;
  } else {
    return user;
  }
};
/**
 * @param {string} query - The secified query.
 * @param {string} data - The modified data.
 * @param {string} schema - The specified schema.
 */
const forceUpdate = async (query, data, schema) => {
  if (!query) return console.log("Argument missing: query.");
  if (!data) return console.log("Argument missing: data.");
  if (!schema) return console.log("Argument missing: schema.");

  const obj = {};

  Object.keys(data).forEach((e) => {
    obj[e] = data[e];
  });

  delete obj._doc._id;
  delete obj._doc.userID_1;
  delete obj._doc.__v;

  await schema.findOneAndUpdate(query, obj._doc, { upsert: true });
  return true;
};

const addXP = async (message, userID, guildID, amount) => {
  const data = await findUser(message, userID, guildID);

  let bool = false;
  data.Statistics.XP += amount;

  if (data.Statistics.XP >= data.Statistics.Level * 100) {
    data.Statistics.XP = 0;
    data.Statistics.Level++;
    data.coins += 1200 * data.Statistics.Level;

    bool = true;
    return { data, bool };
  }

  return { data, bool };
};

const addCoins = async (message, userID, guildID, amount) => {
  const data = await findUser(message, userID, guildID);

  data.coins += amount;

  return data;
};

const formatTime = (time, format) => {
  return `<t:${(time / 1000).toFixed(0)}:${format || "R"}>`;
};

const giveReward = async (author, guild, amount) => {
  let economySchema = require("../schemas/leveling");
  try {
    await economySchema.findOneAndUpdate(
      {
        userID: author,
        guildID: guild,
      },
      {
        $inc: {
          coins: amount,
        },
      }
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports.getRandom = getRandom;
module.exports.sleep = sleep;
module.exports.percentage = percentage;
module.exports.findUser = findUser;
module.exports.forceUpdate = forceUpdate;
module.exports.addXP = addXP;
module.exports.addCoins = addCoins;
module.exports.formatTime = formatTime;
module.exports.giveReward = giveReward;

//Credits: Shark#2538 for coding.
