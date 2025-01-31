require("dotenv/config");
const fs = require("fs");
const path = require("path");
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const schedule = require("node-schedule");
const { scheduleBirthday } = require("./model/Birthday");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

client.commands = new Collection();
client.cooldowns = new Collection();

// Function to Load Commands
function loadCommandsAndEvents() {
  const COMMANDS_PATH = path.join(__dirname, "commands");
  const EVENTS_PATH = path.join(__dirname, "events");

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
}

loadCommandsAndEvents();

schedule.scheduleJob("0 0 * * *", () => scheduleBirthday(client));

client.login(process.env.DISCORD_BOT_TOKEN);
