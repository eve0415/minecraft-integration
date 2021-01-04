import { DJSClient, logger, websocketClient } from '.';
import Config, { ConfigInterface } from './config';
import { database } from './database';

export class Instance {
    public readonly config: ConfigInterface;
    public readonly bot: DJSClient;
    private readonly ws: websocketClient;

    public constructor(config: ConfigInterface) {
        logger.info('Starting Discord bot and Websocket Integrations');
        this.config = config;

        this.bot = new DJSClient(this);
        this.ws = new websocketClient(this);

        this.start();
    }

    private async start() {
        await this.init();

        await this.bot.login().catch(e => {
            logger.error(e);
            logger.shutdown();
            process.exit(1);
        });

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
    public shutdown(): void {
        logger.info('Shutting down');
        this.ws.close();
        this.bot.close();
        logger.shutdown();
        process.exit();
    }
}

const p = new Instance(Config);

process.on('SIGINT', () => {
    p.shutdown();
});
