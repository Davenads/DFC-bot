import { Client, GatewayIntentBits, Guild, Role } from 'discord.js';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

const GUILD_ID = process.env.GUILD_ID!;
const DFC_ROLE_ID = process.env.DFC_ROLE_ID!;
const SPREADSHEET_ID = process.env.SPREADSHEET_ID!;

async function updateUUIDs() {
  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    const role = await guild.roles.fetch(DFC_ROLE_ID);

    if (!role) {
      console.error('DFC role not found');
      return;
    }

    const members = await guild.members.fetch();
    const dfcMembers = members.filter(member => member.roles.cache.has(role.id));

    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Fetch existing data from the 'Roster' tab
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Roster!C:D', // Assuming Discord names are in column C and UUIDs in column D
    });

    const rows = response.data.values || [];
    const updates = [];

    for (const [discordName, currentUUID] of rows) {
      if (!discordName) continue; // Skip rows with blank Discord names

      const member = dfcMembers.find(m => m.user.tag === discordName);
      if (member) {
        updates.push([member.id]); // Push the UUID
      } else {
        updates.push([currentUUID || '']); // Keep existing UUID or empty string
      }
    }

    // Update the UUIDs in column D
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Roster!D2:D', // Start from D2 to skip header
      valueInputOption: 'RAW',
      requestBody: { values: updates },
    });

    console.log('UUIDs updated successfully');
  } catch (error) {
    console.error('Error updating UUIDs:', error);
  }
}

client.once('ready', () => {
  console.log('Bot is ready');
  updateUUIDs();
});

client.login(process.env.BOT_TOKEN);
