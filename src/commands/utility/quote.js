const { SlashCommandBuilder } = require("discord.js");
const Quote = require("../../model/Quote");

module.exports = {
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setName("quote")
    .setDescription("Get daily quote or a random quote")
    .addSubcommand((subcommand) =>
      subcommand.setName("daily").setDescription("Get the quote of the day")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("random").setDescription("Get a random quote")
    ),
  async execute(interaction) {
    const quoteInstant = new Quote(interaction);
    if (interaction.options.getSubcommand() === "daily") {
      quoteInstant.showDailyQuote();
    } else if (interaction.options.getSubcommand() === "random") {
      quoteInstant.showRandomQuote();
    }
  },
};
