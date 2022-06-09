const client = require("../../index");
const chalk = require("chalk");
const multiSchema = require("../../schemas/multi");
const prefix = client.config.prefix;

client.on("messageCreate", async (message) => {

  if (message.author.bot || !message.guild || message.webhookID) return;

  if (!message.content.toLowerCase().startsWith(client.config.prefix)) return;
  if (!message.member)
    message.member = await message.guild.fetchMember(message);
  const [cmd, ...args] = message.content
    .slice(client.config.prefix.length)
    .trim()
    .split(" ");

  const command =
    client.commands.get(cmd.toLowerCase()) ||
    client.commands.find((c) => c.aliases?.includes(cmd.toLowerCase()));
  if (!command) return;
  if (!message.member.permissions.has(command.userpermissions || [])) {
    return;
  } else if (!message.guild.me.permissions.has(command.botpermissions || [])) {
    return;
  }

  let enableSc = await multiSchema.findOne({
    guildID: message.guild.id,
  });

  if (enableSc.levellingDisabled === 1) {
    multiSchema.findOne({ id: message.author.id }, async (err, dataa) => {
      if (err) throw err;
      if (!dataa) {
        const data = await client.functions.findUser(
          message,
          message.author.id,
          message.guild.id
        );
        let multiBot;
        const newMulti = await multiSchema.findOne({
          guildID: message.guild.id,
        });
        if (!newMulti) {
          multiBot = 1;
        } else {
          multiBot = newMulti.multi;
        }
        data.Statistics.CommandsUsed.push(command.name);

        const leveledUp = await client.functions.addXP(
          message,
          message.author.id,
          message.guild.id,
          (Math.floor(Math.random() * 10) + 1) * multiBot
        );
        console.log(multiBot);
        const coins = await client.functions.addCoins(
          message,
          message.author.id,
          message.guild.id,
          1200 * data.Statistics.LEVEL
        );

        data.Statistics.XP = leveledUp.data.Statistics.XP;
        data.Statistics.Level = leveledUp.data.Statistics.Level;

        if (leveledUp.bool === true) {
          data.Coins = coins.Coins;
          message.channel.send(
            `${
              message.author
            }\n <:arrow_right:961073009106485299> You successfully levelled up.\n [ <:whiteDot:962849666674860142> ] Level: **${
              data.Statistics.Level
            }**, +**⏣ ${1200 * data.Statistics.Level}.**`
          );
        }

        await client.functions.forceUpdate(
          { userID: message.author.id, guildID: message.guild.id },
          data,
          require("../../schemas/leveling")
        );
      }
    });
  }
  await command.run(client, message, args);

});
