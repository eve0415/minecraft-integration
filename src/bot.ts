import { Client as DiscordBot } from 'discord.js';
import { logger } from '.';
import { ConfigInterface } from './config';

export class DJSClient extends DiscordBot {
  public readonly config: ConfigInterface;

  public constructor(config: ConfigInterface) {
      super({ restTimeOffset: 100 });
      this.config = config;
  }


  public login(): Promise<string> {
      return super.login();
  }

  public close(): void {
      logger.info('Shutting down bot');
      this.destroy();
  }
}
