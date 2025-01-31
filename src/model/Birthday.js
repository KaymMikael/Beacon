const { getUsersBirthday } = require("../firebase");
const { userMention } = require("discord.js");

/**
 * Sends a birthday greeting to the specified member in the designated channel.
 * @param {GuildMember} member - The member to send the birthday greeting to.
 * @param {Client} client - The Discord client.
 */
function sendBirthdayGreeting(member, client) {
  const channel = client.channels.cache.get(process.env.BIRTHDAYS_CHANNEL_ID);
  if (channel) {
    const userMentionString = userMention(member.id);
    channel.send(
      `🎉 Happy Birthday, ${userMentionString}! 🎂 Enjoy your special day!`
    );
  }
}

/**
 * Schedules a job to check for user birthdays and sends greetings to the server.
 * @param {Client} client - The Discord client.
 */
async function scheduleBirthday(client) {
  try {
    const snapshot = await getUsersBirthday();

    if (!snapshot.length) {
      console.log("No birthdays found.");
      return;
    }

    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    if (!guild) {
      console.error("Guild not found.");
      return;
    }

    // Iterate over the snapshot to fetch user birthdays and send greetings.
    snapshot.forEach(async (doc) => {
      const { userId } = doc.data();

      // Fetch the member from the guild using the user ID.
      const member = await guild.members.fetch(userId);

      if (member) {
        sendBirthdayGreeting(member, client);
      }
    });
  } catch (error) {
    console.error("Error checking birthdays:", error);
  }
}

module.exports = { scheduleBirthday };
