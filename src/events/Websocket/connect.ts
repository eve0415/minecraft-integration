import { logger, websocketClient } from '../..';
import { port, WebsocketEvent } from '../../typings';

export default class extends WebsocketEvent {
    public constructor(client: websocketClient) {
        super(client, 'connect');
    }

    public run(p: port): void {
        if (p) return logger.info(`Successfully identified server ID ${p}`);
        logger.info(`Connected to unknown server. Waiting for update to identify server ID`);
    }
}
