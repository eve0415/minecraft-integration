import { DJSClient, logger, websocketClient } from '.';
import Config, { ConfigInterface } from './config';
import { Database } from './database';
import { MinecraftChatManager, MinecraftLogManager, MinecraftStatusManager } from './managers';
import { Language } from './typings';

export class Instance {
    public readonly config: ConfigInterface;
    public readonly database: Database;
    public readonly bot: DJSClient;
    public readonly ws: websocketClient;
    public readonly statusManager: MinecraftStatusManager;
    public readonly logManager: MinecraftLogManager;
    public readonly chatManager: MinecraftChatManager;

    public constructor(config: ConfigInterface) {
        logger.info('Starting Discord bot and Websocket Integrations');
        this.config = config;

        this.database = new Database();
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

        await this.database.connect();

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
        this.bot.postInit();
        logger.info('Initialize complete...');
    }

    public get localizations(): Language | undefined {
        return this.bot.localizations.getLocalization();
    }

    public async shutdown(): Promise<void> {
        logger.info('Shutting down');
        await Promise.all([
            this.database?.close(),
            this.bot.preShutdown(),
            this.ws.close(),
            this.logManager.shutdown(),
            this.statusManager.shutdown(),
            new Promise(resolve => setTimeout(resolve, 3000)),
        ]);
        this.bot.shutdown();
        logger.shutdown();
        process.exit();
    }
}

const p = new Instance(Config);
let looped = false;

['SIGTERM', 'SIGINT', 'uncaughtException', 'unhandledRejection']
    .forEach(signal => process.on(signal, e => {
        if (looped) process.exit(1);
        looped = true;
        if (!(e === 'SIGINT' || e === 'SIGTERM')) {
            logger.error('Unexpected error occured');
            logger.error(e);
        }
        p.shutdown();
    }));
