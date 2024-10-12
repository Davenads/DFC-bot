// commandHandler.ts
import { Client, Collection } from 'discord.js';
import { Command } from '../types/Command';
import fs from 'fs';
import path from 'path';

export const registerCommands = (client: Client, commandsPath: string): Collection<string, Command> => {
  const commands = new Collection<string, Command>();
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    import(filePath).then((commandModule) => {
      const command: Command = commandModule.default;
      if (command && command.name) {
        commands.set(command.name, command);
      }
    }).catch(err => {
      console.error(`Error loading command ${file}:`, err);
    });
  }

  return commands;
};

export const handleCommand = async (client: Client, commandName: string, ...args: any[]): Promise<void> => {
  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    if (Array.isArray(args)) {
      await command.execute(client, ...args);
    } else {
      console.error('Arguments passed to command.execute are not an array.');
    }
  } catch (error) {
    console.error(`Error executing command ${commandName}:`, error);
  }
};

// index.ts integration example
// import { registerCommands } from './handlers/commandHandler';
// client.commands = registerCommands(client, path.join(__dirname, 'commands'));
// client.on('interactionCreate', async interaction => {
//   if (!interaction.isCommand()) return;
//   await handleCommand(client, interaction.commandName, interaction);
// });