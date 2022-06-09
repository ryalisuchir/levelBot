let blacklist = require(`../../schemas/multi`);
const { MessageEmbed, Permissions } = require("discord.js");

module.exports = {
  name: "blackList",
  aliases: ["bl", "blacklist"],
  description: "Blacklist a user from gaining XP in a specific guild.",
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

    const User =
      message.mentions.members.first() ||
      message.guild.members.cache.find(
        (member) =>
          member.user.username.toLowerCase() === args.join(" ").toLowerCase()
      ) ||
      message.guild.members.cache.get(args[0]) ||
      message.guild.members.cache.find(
        (member) =>
          member.displayName.toLowerCase() === args.join(" ").toLowerCase()
      ) ||
      message.member;
    let serverProfile;
    try {
      serverProfile = await blacklist.findOne({
        guildID: message.guild.id,
      });
    } catch (err) {
      console.log(err);
    }
    if (!serverProfile) {
      serverProfile = new blacklist({
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
    if (User.id == message.author.id)
      return message.reply({
        content: "Why are you trying to blacklist yourself?",
      });

    blacklist.findOne({ id: User.user.id }, async (err, data) => {
      if (err) throw err;
      if (data) {
        message.reply(
          `${User.user.tag} is already blacklisted from ganing XP.`
        );
      } else {
        data = new blacklist({ id: User.user.id });
        data.save().catch((err) => console.log(err));
        const blacklistEmbed = new MessageEmbed()
          .setColor("303136")
          .setDescription(`${User.user.tag} has been blacklisted.`);
        message.channel.send({ embeds: [blacklistEmbed] });
      }
    });
  },
};
