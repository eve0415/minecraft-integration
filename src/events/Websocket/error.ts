import { logger, websocketClient } from '../..';
import { port, WebsocketEvent } from '../../typings';

export default class extends WebsocketEvent {
    public constructor(client: websocketClient) {
        super(client, 'error');
    }

    public run(p: port, error: Error): void {
        logger.error(`An error has occured when communicating with ${!p ? 'unknown server' : `server ID ${p}`}`, error);
    }
}
