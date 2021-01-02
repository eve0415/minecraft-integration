import { Client } from 'discord.js';
import { logger } from '.';
import { CommandManager, DJSEventManager } from './Managers';
import { ConfigInterface } from './config';

export class DJSClient extends Client {
  protected readonly config: ConfigInterface;
  private readonly commands: CommandManager;
  private readonly events: DJSEventManager;

  public constructor(config: ConfigInterface) {
      super({ restTimeOffset: 5, partials: ['GUILD_MEMBER'] });
      this.config = config;
      this.commands = new CommandManager(this);
      this.events = new DJSEventManager(this);
  }

  public async init(): Promise<void> {
      logger.info('Initializing bot');
      await Promise.all([
          this.commands.registerAll(),
          this.events.registerAll(),
      ]);
      logger.info('Initialize complete');
  }

  public login(): Promise<string> {
      return super.login();
  }

  public close(): void {
      logger.info('Shutting down bot');
      this.destroy();
  }
}
