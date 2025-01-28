const { Events, MessageFlags } = require("discord.js");

const allowedChannelIds = [
  process.env.COMMANDS_CHANNEL_ID,
  process.env.DAILY_QUOTES_CHANNEL_ID,
];

// Function to Handle Command Execution
async function handleCommandInteraction(interaction) {
  if (!interaction.isChatInputCommand()) return;

  // Ensure that the channel id from interaction is allowed
  if (!allowedChannelIds.includes(interaction.channelId)) {
    await interaction.reply({
      content: "You can only use commands in specific channels.",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
}

module.exports = {
  name: Events.InteractionCreate,
  execute: handleCommandInteraction,
};
