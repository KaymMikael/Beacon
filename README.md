# Community Helper Bot

Community Helper Bot is a Discord bot designed to automate engagement in your server. It offers daily motivational quotes, birthday reminders, and skill polls to keep the community active, inspired, and connected while reducing the burden on admins.

## Features
- 🎉 **Birthday Reminders**: Never miss a member's special day with automatic birthday reminders.
- 📢 **Daily Motivational Quotes**: Keep your community inspired with a daily quote.
- 🔀 **Random Quotes**: Get an instant boost of motivation with a random quote.
- 📊 **Skill Polls**: Engage your community with interactive polls.
- 📡 **Server Info & User Details**: Retrieve server statistics and user information.
- 🏓 **Ping Command**: Check the bot's latency.

## Commands
| Command | Description |
|---------|-------------|
| `/birthday` | Displays upcoming birthdays in the server. |
| `/quote random` | Sends a randomly selected motivational quote. |
| `/quote daily` | Sends the daily motivational quote. |
| `/ping` | Checks the bot's latency. |
| `/user` | Retrieves information about a user. |
| `/server` | Provides details about the server. |
| `/poll choices` | Creates a skill poll with custom choices. |

## Environment Variables
To run the bot, set up the following environment variables:
- `DISCORD_BOT_TOKEN`: The bot's authentication token.
- `CLIENT_ID`: The bot's client ID.
- `GUILD_ID`: The Discord server ID where the bot will operate.
- `COMMANDS_CHANNEL_ID`: The ID of the channel where commands are executed.
- `BIRTHDAYS_CHANNEL_ID`: The ID of the channel where birthday reminders are posted.
- `POLL_CHANNEL_ID`: The ID of the channel where polls are created.
- `QUOTE_CHANNEL_ID`: The ID of the channel where quotes are shared.

## Necessary Intents
Ensure the bot has the required intents enabled:
```javascript
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});
```

## Usage
Simply type a command in your Discord server to trigger the bot’s response. For example:
```
/quote random
```
will return a random motivational quote.

## Contributing
If you’d like to contribute to the development of this bot, feel free to open an issue or submit a pull request.

## License
This project is licensed under the MIT License.

---

🚀 Keep your community engaged, inspired, and connected with Community Helper Bot!

