const { EmbedBuilder, MessageFlags } = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  cooldown: 30,
  data: new SlashCommandBuilder()
    .setName("daily-quote")
    .setDescription("Get the quote of the day."),
  async execute(interaction) {
    try {
      const response = await fetch("https://zenquotes.io/api/today");
      if (!response.ok) {
        console.log("Not Ok");
        return;
      }
      const result = await response.json();
      const { q: quote, a: author } = result[0];
      const quoteEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("Quote of the Day")
        .setDescription(`**"${quote}**" - *${author}*`);
      interaction.channel.send({ embeds: [quoteEmbed] });
      await interaction.reply({
        content: "Showed the quote of the day",
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
