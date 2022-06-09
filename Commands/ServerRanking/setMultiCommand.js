let multi = require(`../../schemas/multi`);
const { MessageEmbed, Permissions } = require("discord.js");

module.exports = {
  name: "setMultiplier",
  aliases: ["sm", "setmulti"],
  description: "Change the multiplier for a guild.",
  timeout: 2,
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR]))
      return;

    let serverProfile;
    try {
      serverProfile = await multi.findOne({
        guildID: message.guild.id,
      });
    } catch (err) {
      console.log(err);
    }
    if (!serverProfile) {
      serverProfile = new multi({
        guildID: message.guild.id,
        multi: 1,
      });
      serverProfile.save();
    }

    if (serverProfile.levellingDisabled == "off")
      return message.reply({
        embeds: [
          new MessageEmbed().setDescription(
            "The leveling system in this guild has been turned off."
          ),
        ],
      });
    if (!args[0])
      return message.reply({
        content: "Specify a valid multiplier level (must be an integer).",
      });

    function isPositiveInteger(str) {
      if (typeof str !== "string") {
        return false;
      }

      const num = Number(str);

      if (Number.isInteger(num) && num > 0) {
        return true;
      }

      return false;
    }
    if (!isPositiveInteger(args[0]))
      return message.reply({
        content: `Specify a valid multiplier level, that is a positive integer.`,
      });

    let newMulti = parseInt(args[0]);

    if (newMulti > 3 && message.author.id !== "893705256368750592") {
      return message.reply({
        content:
          "You can only set the multiplier for this guild to a maximum value of: **3**.",
      });
    }
    serverProfile.multi = newMulti;
    serverProfile.save();

    message.reply({
      embeds: [
        new MessageEmbed()
          .setDescription(
            `Successfully changed the guild multi to: ${newMulti}%.`
          )
          .setColor("303136"),
      ],
    });
  },
};

//Credits: Shark#2538 for coding.
