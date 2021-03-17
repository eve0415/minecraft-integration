import { Client } from 'discord.js';
import { Instance, logger } from '.';
import { ConfigInterface } from './config';
import { CommandManager, DJSEventManager, LocalizationManager } from './managers';

export class DJSClient extends Client {
    public readonly instance: Instance;
    public readonly localizations: LocalizationManager;
    public readonly commands: CommandManager;
    private readonly events: DJSEventManager;

    public constructor(instance: Instance) {
        super({
            restTimeOffset: 5,
            retryLimit: 5,
            partials: ['GUILD_MEMBER'],
            presence: {
                status: 'dnd',
                activity: {
                    name: 'Initializing...',
                    type: 'PLAYING',
                },
            },
        });
        this.instance = instance;
        this.commands = new CommandManager(this);
        this.events = new DJSEventManager(this);
        this.localizations = new LocalizationManager(this);
    }

    public async init(): Promise<void> {
        logger.info('Initializing bot');
        await Promise.all([
            this.commands.registerAll(),
            this.events.registerAll(),
            this.localizations.registerAll(),
        ]);
        logger.info('Initialize complete');
    }

    public login(): Promise<string> {
        return super.login();
    }

    public postInit(): void {
        this.user?.setPresence({ status: 'online' });
    }

    public preShutdown(): Promise<void> {
        this.user?.setPresence({
            status: 'dnd',
            activity: {
                name: 'Shutting down...',
                type: 'PLAYING',
            },
        });
        return this.events.unregisterAll();
    }

    public shutdown(): void {
        logger.info('Shutting down bot');
        this.destroy();
    }

    get config(): ConfigInterface {
        return this.instance.config;
    }
}
