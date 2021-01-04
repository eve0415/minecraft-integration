import { Client } from 'discord.js';
import { logger, Instance } from '.';
import { CommandManager, DJSEventManager } from './Managers';

export class DJSClient extends Client {
  public readonly instance: Instance;
  private readonly commands: CommandManager;
  private readonly events: DJSEventManager;

  public constructor(instance: Instance) {
      super({ restTimeOffset: 5, partials: ['GUILD_MEMBER'] });
      this.instance = instance;
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
