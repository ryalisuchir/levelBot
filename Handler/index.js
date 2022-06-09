const { glob } = require("glob");
const { promisify } = require("util");
const { Client } = require("discord.js");
const globPromise = promisify(glob);
const mainjson = require("../BotConfiguration/settings.json");
const chalk = require("chalk");
module.exports = async (client) => {
  // ———————————————[Commands]———————————————
  const commandFiles = await globPromise(`${process.cwd()}/Commands/**/*.js`);
  commandFiles.map((value) => {
    const file = require(value);
    const splitted = value.split("/");
    const directory = splitted[splitted.length - 2];

    if (file.name) {
      const properties = { directory, ...file };
      client.commands.set(file.name, properties);
    }
  });

  // ———————————————[Events]———————————————
  const eventFiles = await globPromise(`${process.cwd()}/Events/*/*.js`);
  eventFiles.map((value) => require(value));

};

//Created by Shark#2538
