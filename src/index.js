require("dotenv/config");
const fs = require("fs");
const path = require("path");
const { Client, GatewayIntentBits, Collection } = require("discord.js");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
client.cooldowns = new Collection();

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

const EVENTS_PATH = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(EVENTS_PATH)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(EVENTS_PATH, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

loadCommands();

client.login(process.env.DISCORD_BOT_TOKEN);
