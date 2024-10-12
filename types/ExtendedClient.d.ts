import { Client, Collection } from 'discord.js';
import { Command } from './Command';

declare module 'discord.js' {
  export interface Client {
    commands: Collection<string, Command>;
  }
}