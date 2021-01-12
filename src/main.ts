import { DJSClient, logger, websocketClient } from '.';
import { MinecraftChatManager, MinecraftLogManager, MinecraftStatusManager } from './Managers';
import Config, { ConfigInterface } from './config';
import { database } from './database';
import { Language } from './typings';

export class Instance {
    public readonly config: ConfigInterface;
    public readonly bot: DJSClient;
    private readonly ws: websocketClient;
    public readonly statusManager: MinecraftStatusManager;
    public readonly logManager: MinecraftLogManager;
    public readonly chatManager: MinecraftChatManager;

    public constructor(config: ConfigInterface) {
        logger.info('Starting Discord bot and Websocket Integrations');
        this.config = config;

        this.bot = new DJSClient(this);
        this.ws = new websocketClient(this);
        this.statusManager = new MinecraftStatusManager(this);
        this.logManager = new MinecraftLogManager(this);
        this.chatManager = new MinecraftChatManager(this);

        this.start();
    }

    private async start() {
        await this.init();

        await this.bot.login().catch(e => {
            logger.error(e);
            logger.shutdown();
            process.exit(1);
        });

        await this.postInit();

        // Ready to serve
        this.ws.open();
    }

    private async init() {
        logger.info('Initializing...');
        database.init();

        await this.bot.init().catch(e => {
            logger.error(e);
        });

        await this.ws.init().catch(e => {
            logger.error(e);
        });
    }

    // This initialization should be executed after bot has logged in
    // or else it won't work.
    private async postInit() {
        logger.info('Post initialization started!');
        await this.statusManager.init();
        await this.logManager.init();
        await this.chatManager.init();
        logger.info('Initialize complete...');
    }

    public get localizations(): Language | undefined {
        return this.bot.localizations.getLocalization();
    }

    public shutdown(): void {
        logger.info('Shutting down');
        this.ws.close();
        this.bot.close();
        logger.shutdown();
        process.exit();
    }
}

const p = new Instance(Config);

['SIGINT', 'uncaughtException', 'unhandledRejection']
    .forEach(signal => process.on(signal, e => {
        logger.error('Unexpected error occured');
        logger.error(e);
        p.shutdown();
    }));
