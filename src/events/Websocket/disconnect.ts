import { logger, websocketClient } from '../..';
import { port, WebsocketEvent } from '../../typings';

export default class extends WebsocketEvent {
    public constructor(client: websocketClient) {
        super(client, 'disconnect');
    }

    public run(p: port, reason: string): void {
        logger.info(`Disconnected from ${!p ? 'unknown server' : `server ID: ${p}`}`, reason);
    }
}
