const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("birthday")
    .setDescription("This command sets the user's birthday")
    .addStringOption((option) =>
      option
        .setName("set-birthday")
        .setDescription("Birthday format: YYYY-MM-DD")
        .setRequired(true)
        .setMaxLength(10)
    ),
  async execute(interaction) {
    const birthday = interaction.options.getString("set-birthday");
    const isValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(birthday);

    // Check if birthday is valid format
    if (!isValidFormat) {
      await interaction.reply({
        content: "⚠️ Please use the format: /setbirthday YYYY-MM-DD",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    await interaction.reply({
      content: `Your input: ${birthday}`,
      flags: MessageFlags.Ephemeral,
    });
  },
};
