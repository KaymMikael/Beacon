const { MessageFlags, EmbedBuilder } = require("discord.js");

class Quote {
  #interaction;

  /**
   * Constructor to initialize the Quote class.
   * @param {Object} interaction - The interaction object from Discord.
   */
  constructor(interaction) {
    this.#interaction = interaction;
  }

  /**
   * Show the daily quote by fetching it from the ZenQuotes API.
   * It defers the reply, fetches the quote, and then sends it as an embedded message.
   * If an error occurs, it logs the error and informs the user.
   */
  async showDailyQuote() {
    try {
      await this.#interaction.deferReply({ flags: MessageFlags.Ephemeral });

      // Fetch the quote of the day from the ZenQuotes API.
      const response = await fetch("https://zenquotes.io/api/today");
      if (!response.ok) {
        console.log("Not Ok");
        return;
      }

      // Parse the response to JSON and extract the quote and author.
      const result = await response.json();
      const { q: quote, a: author } = result[0];

      // Create an embedded message with the quote of the day.
      const quoteEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("Quote of the Day")
        .setDescription(`**"${quote}**" - *${author}*`);

      // Send the embedded message to the channel.
      this.#interaction.channel.send({ embeds: [quoteEmbed] });

      // Edit the original reply to inform the user that the quote was shown.
      await this.#interaction.editReply({
        content: "Showed the quote of the day",
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      console.log(error);

      // Edit the original reply to inform the user about the error.
      await this.#interaction.editReply({
        content: "An error occurred while getting a quote",
        flags: MessageFlags.Ephemeral,
      });
    }
  }

  /**
   * Show a random quote by fetching it from the ZenQuotes API.
   * It defers the reply, fetches the quote, and then sends it as an embedded message.
   * If an error occurs, it logs the error and informs the user.
   */
  async showRandomQuote() {
    try {
      await this.#interaction.deferReply({ flags: MessageFlags.Ephemeral });

      // Fetch a random quote from the ZenQuotes API.
      const response = await fetch("https://zenquotes.io/api/random");
      const result = await response.json();
      const { q: quote, a: author } = result[0];

      // Create an embedded message with the random quote.
      const quoteEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("Random Quote")
        .setDescription(`**"${quote}**" - *${author}*`);

      // Send the embedded message to the channel.
      this.#interaction.channel.send({ embeds: [quoteEmbed] });

      // Edit the original reply to inform the user that the quote was shown.
      await this.#interaction.editReply({
        content: "Showed a random quote",
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      console.log(error);

      // Edit the original reply to inform the user about the error.
      await this.#interaction.editReply({
        content: "An error occurred while getting a quote",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
}

module.exports = Quote;
