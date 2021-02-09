import { websocketClient } from '../..';
import { database } from '../../database';
import { ServerInfo, WebsocketEvent } from '../../typings';

export default class extends WebsocketEvent {
    public constructor(client: websocketClient) {
        super(client, 'serverInfo');
    }

    public run(data: ServerInfo): void {
        const cache: ServerInfo = {};
        Object.keys(data).forEach(port => {
            const info = database.server.getFromID(Number(port));
            if (!info) {
                cache[port] = data[port];
            } else if (info.name !== data[port]) {
                database.server.setName(info.ID, data[port]);
                this.client.instance.statusManager.setName(info.ID, data[port]);
                this.client.instance.statusManager.refreshStatus(info.ID);
            }
        });
        this.client.instance.statusManager.cacheUnknownServer(cache);
    }
}
