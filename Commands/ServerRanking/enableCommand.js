let multiSchema = require(`../../schemas/multi`);
const {
  MessageEmbed,
  MessageButton,
  MessageActionRow,
  Permissions,
} = require("discord.js");
const wait = require("node:timers/promises").setTimeout;
let CurrencyEmoji = "⏣ ";

module.exports = {
  name: "enableCommand",
  aliases: ["ed", "enabledisable", "enable", "disable"],
  description: "Enable or disable the leveling system in a guild.",
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

    let multi;
    try {
      multi = await multiSchema.findOne({
        guildID: message.guild.id,
      });
    } catch (err) {
      console.log(err);
    }
    if (!multi) {
      multi = new multiSchema({
        guildID: message.guild.id,
        levellingDisabled: "on",
      });
      multi.save();
    }
    //disabled
    let sentMsg;
    if (multi.levellingDisabled === 2) {
      sentMsg = await message.reply({
        content: `Use the interaction below:`,
        components: [
          new MessageActionRow().addComponents(
            new MessageButton()
              .setStyle("SECONDARY")
              .setCustomId("Enable")
              .setLabel("Enable"),
            new MessageButton()
              .setStyle("SECONDARY")
              .setCustomId("DisableD")
              .setLabel("Disable")
              .setDisabled()
          ),
        ],
      });
    } else {
      sentMsg = await message.reply({
        content: `Use the interaction below:`,
        components: [
          new MessageActionRow().addComponents(
            new MessageButton()
              .setStyle("SECONDARY")
              .setCustomId("EnableD")
              .setLabel("Enable")
              .setDisabled(),
            new MessageButton()
              .setStyle("SECONDARY")
              .setCustomId("Disable")
              .setLabel("Disable")
          ),
        ],
      });
    }

    const filter = (i) => i.user.id === message.author.id;

    const collector = message.channel.createMessageComponentCollector({
      filter,
      time: 15000,
    });

    collector.on("collect", async (i) => {
      const disabledRow = new MessageActionRow().addComponents(
        new MessageButton()
          .setStyle("SECONDARY")
          .setCustomId("ee")
          .setLabel("Enable")
          .setDisabled(),
        new MessageButton()
          .setStyle("SECONDARY")
          .setCustomId("dd")
          .setLabel("Disable")
          .setDisabled()
      );
      if (i.customId === "Enable") {
        await i.deferUpdate();
        await wait(1500);
        let multiEnable;
        try {
          multiEnable = await multiSchema.findOne({
            guildID: message.guild.id,
          });
        } catch (err) {
          console.log(err);
        }
        multiEnable.levellingDisabled = 1;
        multiEnable.save();
        await i.editReply({
          content: "The levelling system for this guild has been turned on.",
          components: [disabledRow],
        });
      }
      if (i.customId === "Disable") {
        await i.deferUpdate();
        await wait(1500);
        let multiDisable;
        try {
          multiDisable = await multiSchema.findOne({
            guildID: message.guild.id,
          });
        } catch (err) {
          console.log(err);
        }
        multiDisable.levellingDisabled = 2;
        multiDisable.save();
        await i.editReply({
          content: "The levelling system for this guild has been turned off.",
          components: [disabledRow],
        });
      }
    });
    //end collector
  },
};

//Credits: Shark#2538 for coding.
//Credits: alexandra ࿐#1982 for aesthetics.
