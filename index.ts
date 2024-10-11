// index.ts for DFC-bot
import { Client, GatewayIntentBits } from 'discord.js';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID);

async function accessSpreadsheet() {
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  });
  await doc.loadInfo();
}

client.once('ready', () => {
  console.log('DFC-bot is online!');
  accessSpreadsheet().catch((err) => console.error('Error accessing spreadsheet:', err));
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, member } = interaction;
  const userRoles = member?.roles.cache;
  const hasDuelerRole = userRoles?.some((role) => role.name === 'DFC Dueler');
  const isModerator = userRoles?.some((role) => role.name === 'Moderator');

  if (!hasDuelerRole) {
    await interaction.reply({ content: 'You need the @DFC Dueler role to use this command.', ephemeral: true });
    return;
  }

  try {
    switch (commandName) {
      case 'register':
        // Logic to register a player for the weekly event
        await interaction.reply('You have been registered for this week's event!');
        break;
      case 'reportwin':
        // Logic for reporting wins
        await interaction.reply('Win has been reported successfully!');
        break;
      case 'creatematchup':
        if (!isModerator) {
          await interaction.reply({ content: 'Only moderators can create matchups.', ephemeral: true });
          return;
        }
        // Logic for creating matchups in the fight card tab
        await interaction.reply('Matchup has been created successfully!');
        break;
      default:
        await interaction.reply({ content: 'Unknown command!', ephemeral: true });
    }
  } catch (error) {
    console.error('Error handling interaction:', error);
    await interaction.reply({ content: 'There was an error while processing your request.', ephemeral: true });
  }
});

client.login(process.env.DISCORD_TOKEN);