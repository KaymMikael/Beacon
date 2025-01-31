const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const {
  addBirthday,
  isUserBirthdayExists,
} = require("../../firebase/index.js");
const { isValidBirthday } = require("../../utility/date.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("birthday")
    .setDescription("This command sets the user's birthday")
    .addStringOption((option) =>
      option
        .setName("date")
        .setDescription("Birthday format (1999-01-23): YYYY-MM-DD")
        .setRequired(true)
        .setMaxLength(10)
    ),
  async execute(interaction) {
    // Extract the date string from the interaction options.
    const date = interaction.options.getString("date");
    // Get the user ID of the interaction user.
    const userId = interaction.user.id;

    // Defer the reply to allow processing time.
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    // Check if the birthday format is valid.
    if (!isValidBirthday(date)) {
      // Inform the user about the correct birthday format.
      await interaction.editReply({
        content:
          "⚠️ Please use the format (1999-01-23): /setbirthday YYYY-MM-DD",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    // Convert the input date to date object
    const dateBirthdayObj = new Date(date);

    try {
      // Check if the user has already set a birthday.
      const isBirthdayExists = await isUserBirthdayExists(userId);
      if (isBirthdayExists) {
        // Inform the user that they have already set a birthday.
        await interaction.editReply({
          content: "You have already set a birthday",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      // Add the user's birthday to the database.
      await addBirthday(userId, dateBirthdayObj);

      // Confirm to the user that their birthday has been set.
      await interaction.editReply({
        content: `Your birthday has been set to: ${date}`,
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      console.error("Error adding birthday:", error);

      // Inform the user about the error encountered while setting the birthday.
      await interaction.editReply({
        content:
          "There was an error while setting your birthday. Please try again.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
