const {
  SlashCommandBuilder,
  EmbedBuilder,
  MessageFlags,
} = require("discord.js");

module.exports = {
  cooldown: 60,
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Command to create a skill poll")
    .addStringOption((option) =>
      option
        .setName("choices")
        .setDescription(
          "Comma-separated choices with emojis, e.g., 💻 choice1, 👨‍💻 choice2"
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const choicesStr = interaction.options.getString("choices");

    // convert choices string to an array of choices
    const choicesArr = choicesStr.split(",");

    if (choicesArr.length < 2) {
      await interaction.editReply({
        content:
          "⚠️ Please provide at least two options for the poll (comma-separated).",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const embedDescription = choicesArr
      .map((choices) => choices.trim())
      .join("\n");
    const embed = new EmbedBuilder()
      .setTitle("📊 Skill Poll")
      .setDescription(embedDescription)
      .setColor(0x0099ff);

    const channel = interaction.guild.channels.cache.get(
      process.env.POLL_CHANNEL_ID
    );

    if (!channel) {
      await interaction.editReply({
        content: "⚠️ The #skill-polls channel does not exist.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const pollMessage = await channel.send({ embeds: [embed] });
    // Add reactions for each choice
    for (const choice of choicesArr) {
      const emoji = choice.trim().split(" ")[0]; // Extract the emoji from the choice
      if (emoji) {
        await pollMessage.react(emoji);
      }
    }

    await interaction.editReply({
      content: "The poll has been created successfully!",
      flags: MessageFlags.Ephemeral,
    });
  },
};
