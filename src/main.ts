import { DJSClient, logger, websocketClient } from '.';
import Config from './config';

const bot = new DJSClient(Config);
const ws = new websocketClient(Config);

const start = async () => {
    logger.info('Starting Discord bot and Websocket Integrations');

    await bot.init().catch(e => {
        logger.error(e);
    });

    await ws.init().catch(e => {
        logger.error(e);
    });

    await bot.login().catch(e => {
        logger.error(e);
        logger.shutdown();
        process.exit(1);
    });
    ws.open();
};

process.on('SIGINT', () => {
    logger.info('Shutting down');
    ws.close();
    bot.close();
    logger.shutdown();
});

start();
