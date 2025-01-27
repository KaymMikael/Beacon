require("dotenv/config");
const fs = require("fs");
const path = require("path");
const { Client, Events, GatewayIntentBits, Collection } = require("discord.js");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const COMMANDS_PATH = path.join(__dirname, "commands");

// Function to Load Commands
function loadCommands() {
  const commandFolders = fs.readdirSync(COMMANDS_PATH);

  for (const folder of commandFolders) {
    const folderPath = path.join(COMMANDS_PATH, folder);
    const commandFiles = fs
      .readdirSync(folderPath)
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const commandPath = path.join(folderPath, file);
      const command = require(commandPath);

      if (command.data && command.execute) {
        client.commands.set(command.data.name, command);
      } else {
        console.warn(
          `[WARNING] The command at ${commandPath} is missing a required "data" or "execute" property.`
        );
      }
    }
  }
}

// Function to Handle Command Execution
async function handleCommandInteraction(interaction) {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error executing command ${interaction.commandName}:`, error);

    const response = {
      content: "There was an error while executing this command!",
      ephemeral: true,
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(response);
    } else {
      await interaction.reply(response);
    }
  }
}

client.once(Events.ClientReady, (readyClient) => {
  console.log(`${readyClient.user.tag} is ready`);
});

client.on(Events.InteractionCreate, handleCommandInteraction);

loadCommands();

client.login(process.env.DISCORD_BOT_TOKEN);
