const {
  SlashCommandBuilder,
  EmbedBuilder,
  MessageFlags,
} = require("discord.js");

module.exports = {
  cooldown: 30,
  data: new SlashCommandBuilder()
    .setName("quote")
    .setDescription("Get a random quote."),
  async execute(interaction) {
    try {
      const response = await fetch("https://zenquotes.io/api/random");
      const result = await response.json();
      const { q: quote, a: author } = result[0];
      const quoteEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("Random Quote")
        .setDescription(`**"${quote}**" - *${author}*`);
      interaction.channel.send({ embeds: [quoteEmbed] });
      await interaction.reply({
        content: "Showed a random quote",
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      console.log(error);
      await interaction.reply({
        content: "An error occurred while getting a quote",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
