import { logger } from '..';

interface configInterface {
  prefix: string;
  owner: string;
  port: number;
}

export type ConfigInterface = Readonly<configInterface>;

class Config implements ConfigInterface {
  public readonly prefix: string;
  public readonly owner: string;
  public readonly port: number;

  public constructor() {
      this.checkEnvironment();
      this.prefix = process.env.botPrefix ?? '/';
      this.owner = process.env.owner ?? '';
      this.port = Number(process.env.port) ?? 0;
  }

  private checkEnvironment() {
      if (!process.env.DISCORD_TOKEN) return new Error('Please set DISOCRD_TOKEN in your .env file');
      if (!process.env.owner) return new Error('No owner ID found! Please set owner in your /env file');
      if (!process.env.port) return new Error('No port number found! Please set port in your .env file');
      if (!process.env.prefix) logger.warn('No prefix was set! Using the default / for prefix');
  }
}

export default new Config();
