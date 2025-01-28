const { Events, MessageFlags, Collection } = require("discord.js");

const allowedChannelIds = [process.env.COMMANDS_CHANNEL_ID];

// Function to Handle Command Execution
async function handleCommandInteraction(interaction) {
  if (!interaction.isChatInputCommand()) return;

  // Ensure that the channel id from interaction is allowed
  if (!allowedChannelIds.includes(interaction.channelId)) {
    await interaction.reply({
      content: "You can only use commands in specific channels.",
      ephemeral: true,
    });
    return;
  }

  const command = interaction.client.commands.get(interaction.commandName);

  const { cooldowns } = interaction.client;

  if (!cooldowns.has(command.data.name)) {
    cooldowns.set(command.data.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.data.name);
  const defaultCooldownDuration = 3;
  const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;

  if (timestamps.has(interaction.user.id)) {
    const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

    if (now < expirationTime) {
      const expiredTimestamp = Math.round(expirationTime / 1_000);
      return interaction.reply({
        content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
        flags: MessageFlags.Ephemeral,
      });
    }
  }

  timestamps.set(interaction.user.id, now);
  setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

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
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
}

module.exports = {
  name: Events.InteractionCreate,
  execute: handleCommandInteraction,
};
