const { Events, Collection, MessageFlags } = require("discord.js");

const allowedChannelIds = [process.env.COMMANDS_CHANNEL_ID];

// Check if the command is allowed in the current channel
const isAllowedChannel = (channelId) => allowedChannelIds.includes(channelId);

/**
 * this function is used to handle cooldown
 *
 * returns true if the user is not on cooldown
 *
 * returns false if the user is on cooldown
 */
const handleCooldowns = (interaction, command) => {
  const { cooldowns } = interaction.client;

  if (!cooldowns.has(command.data.name)) {
    cooldowns.set(command.data.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.data.name);
  const defaultCooldownDuration = 3; // Default cooldown duration in seconds
  const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;

  if (timestamps.has(interaction.user.id)) {
    const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

    if (now < expirationTime) {
      const expiredTimestamp = Math.round(expirationTime / 1_000);
      interaction.reply({
        content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
        flags: MessageFlags.Ephemeral,
      });
      return false;
    }
  }

  timestamps.set(interaction.user.id, now);
  setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
  return true;
};

// Execute the command
const executeCommand = async (interaction, command) => {
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
};

// Main function to handle command interaction
async function handleCommandInteraction(interaction) {
  if (!interaction.isChatInputCommand()) return;

  if (!isAllowedChannel(interaction.channelId)) {
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

  if (!handleCooldowns(interaction, command)) {
    return;
  }

  await executeCommand(interaction, command);
}

module.exports = {
  name: Events.InteractionCreate,
  execute: handleCommandInteraction,
};
