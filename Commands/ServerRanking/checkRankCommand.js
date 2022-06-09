let currency = require(`../../schemas/leveling`);
let multi = require(`../../schemas/multi`);
const {
	MessageEmbed,
	MessageButton,
	MessageActionRow
} = require("discord.js");
let CurrencyEmoji = "⏣ ";

module.exports = {
  name: "rankCommand",
  aliases: ["r", "rank"],
  description: "Check a user's current rank.",
  timeout: 2,
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const member =
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

    let profile;
    try {
      profile = await currency.findOne({
        userID: member.id,
        guildID: message.guild.id,
      });
    } catch (err) {
      console.log(err);
    }

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

    const rankEmbed = new MessageEmbed()
      .setTitle(`${member.user.username}'s Rank`)
      .addField(
        "<:green:925389347631534090> ꒱  **Level:**",
        `\`\`\`yaml\n${profile.Statistics.Level.toLocaleString()}\`\`\``,
        true
      )
      .addField(
        "<:green:925389347631534090> ꒱  **XP:**",
        `\`\`\`yaml\n${profile.Statistics.XP.toLocaleString()}\`\`\``,
        true
      )
      .setDescription(`Updated as of: <t:${Math.round(Date.now() / 1000)}>`)
      .setFooter({
        text: `You have run ${profile.Statistics.CommandsUsed.length} commands since the creation of your account.`,
      })
      .setColor(`#303136`);
    message.reply({
      embeds: [rankEmbed],
      components: [
        new MessageActionRow().addComponents(
          new MessageButton()
            .setStyle("SECONDARY")
            .setDisabled(true)
            .setLabel(`${serverProfile.multi}%`)
            .setCustomId("MultiButton") //not used
        ),
      ],
    });
  },
};

//Credits: Shark#2538 for coding.
//Credits: alexandra ࿐#1982 for aesthetics.
