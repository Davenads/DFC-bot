export interface Command {
    name: string;
    description: string;
    execute: (client: Client, ...args: any[]) => Promise<void>;
  }
  