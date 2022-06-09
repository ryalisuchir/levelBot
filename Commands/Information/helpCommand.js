const {
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
  MessageButton
} = require("discord.js");

module.exports = {
	formalName: "helpCommand",
  name: "help",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
	  run: async (client, message, args) => {

	const directories = [
      ...new Set(client.commands.map((cmd) => cmd.directory)),
    ];
    const formatString = (str) =>
      `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;
    const categories = directories.map((dir) => {
      const getCommands = client.commands
        .filter((cmd) => cmd.directory === dir)
        .map((cmd) => {
          return {
            name: cmd.name,
            description: cmd.description || "There is no description for this command.",
          };
        });
      return {
        directory: formatString(dir),
        commands: getCommands,
      };
    });
    const embed2 = new MessageEmbed().setTitle("Help Menu").setColor('303136')
    const components = (state) => [
      new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId("help-menu")
          .setPlaceholder("Select a category...")
          .setDisabled(state)
          .addOptions(
            {
							label: 'Level',
							value: 'serverranking',
						},
          ),
)

    ];



    const initialMessage = await message.channel.send({
      embeds: [embed2],
      components: components(false),
    });
    const filter = (interaction) => interaction.user.id === message.author.id;
    const collector = message.channel.createMessageComponentCollector({
      filter,
      componentType: "SELECT_MENU",
      time: 18000,
    });
    collector.on("collect", (interaction) => {
      const [directory] = interaction.values;
      const category = categories.find(
        (x) => x.directory.toLowerCase() === directory
      );

      const categoryEmbed = new MessageEmbed()
        .addFields(
          category.commands.map((cmd) => {
            return {
              name: `${cmd.name}`,
              value: `\` - \` ${cmd.description}`,
              inline: false,
            };
          })
        )
        .setColor('303136');

      interaction.update({ embeds: [categoryEmbed] });
    });
    collector.on("end", () => {
      initialMessage.edit({ components: components(true) });
    });
  },
};
