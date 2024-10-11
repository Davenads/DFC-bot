import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, EmbedBuilder } from 'discord.js';
import { google } from 'googleapis';
import credentials from '../config/credentials.json';

const sheets = google.sheets('v4');
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const SPREADSHEET_ID = 'your_spreadsheet_id';
const ROSTER_TAB = 'Roster';
const SIGNUPS_TAB = 'Weekly Signups';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('signup')
    .setDescription('Sign up for the weekly event')
    .addStringOption(option =>
      option.setName('class')
        .setDescription('Character class')
        .setRequired(true)
        .addChoices(
          { name: 'Amazon', value: 'Amazon' },
          { name: 'Assassin', value: 'Assassin' },
          { name: 'Barbarian', value: 'Barbarian' },
          { name: 'Druid', value: 'Druid' },
          { name: 'Necromancer', value: 'Necromancer' },
          { name: 'Paladin', value: 'Paladin' },
          { name: 'Sorceress', value: 'Sorceress' },
        )
    )
    .addStringOption(option =>
      option.setName('build')
        .setDescription('Character build')
        .setRequired(true)
        .addChoices(
          { name: 'Wind', value: 'Wind' },
          { name: 'Shaman', value: 'Shaman' },
          { name: 'Fire Druid', value: 'Fire Druid' },
          { name: 'Summon', value: 'Summon' },
          { name: 'Fury', value: 'Fury' },
          { name: 'Ghost', value: 'Ghost' },
          { name: 'Trapper', value: 'Trapper' },
          { name: 'Spider', value: 'Spider' },
          { name: 'Blade', value: 'Blade' },
          { name: 'Kicker', value: 'Kicker' },
          { name: 'Hybrid WOF', value: 'Hybrid WOF' },
          { name: 'Hybrid LS', value: 'Hybrid LS' },
          { name: 'Hybrid WW', value: 'Hybrid WW' },
          { name: 'Other', value: 'Other' },
          { name: 'Tribird', value: 'Tribird' },
          { name: 'Telebow', value: 'Telebow' },
          { name: 'Fort Tele Zon', value: 'Fort Tele Zon' },
          { name: 'CS Hybrid Bowa', value: 'CS Hybrid Bowa' },
          { name: 'CS Zon', value: 'CS Zon' },
          { name: 'Hybrid', value: 'Hybrid' },
          { name: 'Walkbow', value: 'Walkbow' },
          { name: 'Jab', value: 'Jab' },
          { name: 'Javazon', value: 'Javazon' },
          { name: 'Bow Sorc', value: 'Bow Sorc' },
          { name: 'Cold ES', value: 'Cold ES' },
          { name: 'Cold Vita', value: 'Cold Vita' },
          { name: 'Lite ES', value: 'Lite ES' },
          { name: 'Lite Vita', value: 'Lite Vita' },
          { name: 'Fire Vita', value: 'Fire Vita' },
          { name: 'T/V', value: 'T/V' },
          { name: 'Murderin', value: 'Murderin' },
          { name: 'Mage', value: 'Mage' },
          { name: 'Auradin', value: 'Auradin' },
          { name: 'V/T', value: 'V/T' },
          { name: 'Hammerdin', value: 'Hammerdin' },
          { name: 'Vanquisher', value: 'Vanquisher' },
          { name: 'V/C', value: 'V/C' },
          { name: 'Zealot', value: 'Zealot' },
          { name: 'Ranger', value: 'Ranger' },
          { name: 'Poondin', value: 'Poondin' },
          { name: 'Liberator', value: 'Liberator' },
          { name: 'Zeal/FoH', value: 'Zeal/FoH' },
          { name: 'Charger', value: 'Charger' },
          { name: 'Poison', value: 'Poison' },
          { name: 'Bone', value: 'Bone' },
          { name: 'Bone/Psn Hybrid', value: 'Bone/Psn Hybrid' },
          { name: 'Psn Dagger', value: 'Psn Dagger' },
          { name: 'Throw/WW Hybrid', value: 'Throw/WW Hybrid' },
          { name: 'BvC', value: 'BvC' },
          { name: 'BvB', value: 'BvB' },
          { name: 'BvA', value: 'BvA' },
          { name: 'Singer', value: 'Singer' },
          { name: 'Concentrate', value: 'Concentrate' },
        )
    ),
  async execute(interaction: CommandInteraction) {
    await interaction.deferReply();

    const userClass = interaction.options.get('class')?.value as string;
    const build = interaction.options.get('build')?.value as string;
    const discordUsername = interaction.user.username;

    try {
      const authClient = await auth.getClient();

      // Get roster data to crosscheck Discord username
      const rosterRes = await sheets.spreadsheets.values.get({
        auth: authClient,
        spreadsheetId: SPREADSHEET_ID,
        range: `${ROSTER_TAB}!A:Z`
      });

      const rosterValues = rosterRes.data.values;
      if (!rosterValues) {
        throw new Error('No roster data found');
      }

      // Find user's name from roster
      const userRow = rosterValues.find(row => row[1] === discordUsername);
      if (!userRow) {
        throw new Error('Your Discord username was not found in the roster. Please contact an admin.');
      }

      const name = userRow[0];

      // Add signup entry to Weekly Signups tab
      await sheets.spreadsheets.values.append({
        auth: authClient,
        spreadsheetId: SPREADSHEET_ID,
        range: `${SIGNUPS_TAB}!A:D`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[name, userClass, build, 'HLD']] // Default match type to 'HLD'
        }
      });

      // Create success embed message
      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('✅ Signup Successful!')
        .setDescription(`You have successfully signed up for the weekly event!`)
        .addFields(
          { name: 'Player', value: `👤 ${name}`, inline: true },
          { name: 'Class', value: `🛡️ ${userClass}`, inline: true },
          { name: 'Build', value: `⚔️ ${build}`, inline: true }
        )
        .setFooter({ text: 'Good luck in your upcoming battles! 💪🔥' });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Error adding signup:', error);
      await interaction.editReply('There was an error while trying to sign you up. Please try again later or contact an admin.');
    }
  }
};