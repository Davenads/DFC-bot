const { SlashCommandBuilder, MessageEmbed } = require('discord.js');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const credentials = require('../config/credentials.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('register')
    .setDescription('Register for the DFC roster')
    .addStringOption(option =>
      option.setName('character_name')
        .setDescription('Enter your character name')
        .setRequired(true)
    ),
  async execute(interaction) {
    const characterName = interaction.options.getString('character_name');
    const userId = interaction.user.id;
    const username = interaction.user.tag;
    const guild = interaction.guild;
    const member = guild.members.cache.get(userId);

    await interaction.deferReply();

    try {
      // Load the Google Sheet
      const doc = new GoogleSpreadsheet('<YOUR_GOOGLE_SHEET_ID>');
      await doc.useServiceAccountAuth(credentials);
      await doc.loadInfo();

      const sheet = doc.sheetsByTitle['Roster'];

      // Check if the user is already registered
      await sheet.loadCells('A1:J100'); // Adjust the range as necessary
      let alreadyRegistered = false;
      for (let rowIndex = 0; rowIndex < sheet.rowCount; rowIndex++) {
        const userIdCell = sheet.getCell(rowIndex, 2); // Assuming Column C contains User IDs
        if (userIdCell.value === userId) {
          alreadyRegistered = true;
          break;
        }
      }

      if (alreadyRegistered) {
        await interaction.editReply('You are already registered on the roster.');
        return;
      }

      // Add the registration data to the sheet
      await sheet.addRow({
        'Arena Name': characterName,
        'Discord Name': username,
        'Discord User ID': userId,
        'Battle Tag': '',
        'DFC Role': 'Yes',
        'Champion': '',
        'Current Champ': '',
        'Titles': '',
        'Notes': '',
        'Leave Status': ''
      });

      // Assign '@DFC Dueler' role if the user does not have it
      const role = guild.roles.cache.find(r => r.name === 'DFC Dueler');
      if (role && !member.roles.cache.has(role.id)) {
        await member.roles.add(role);
      }

      // Create an embed message for successful registration
      const embed = new MessageEmbed()
        .setColor('#00FF00')
        .setTitle('Registration Successful!')
        .setDescription(`🎉 You have been successfully registered for the DFC roster as **${characterName}**!`)
        .addField('Character Name', characterName, true)
        .addField('Discord Username', username, true)
        .setFooter('Good luck in the championship! 💪');

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Error accessing Google Sheets:', error);
      await interaction.editReply('There was an error while registering. Please try again later.');
    }
  }
};