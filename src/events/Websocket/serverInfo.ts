import { websocketClient } from '../..';
import { Server } from '../../database';
import { ServerInfo, WebsocketEvent } from '../../typings';

export default class extends WebsocketEvent {
    public constructor(client: websocketClient) {
        super(client, 'serverInfo');
    }

    public run(data: ServerInfo): void {
        const cache: ServerInfo = {};
        Object.keys(data).forEach(async port => {
            const info = await Server.findOne({ serverID: port });
            if (!info) {
                cache[port] = data[port];
            } else if (info.name !== data[port]) {
                info.name = data[port];
                await info.save();
                this.client.instance.statusManager.setName(info.serverID, data[port]);
                this.client.instance.statusManager.refreshStatus(info.serverID);
            }
        });
        this.client.instance.statusManager.cacheUnknownServer(cache);
    }
}
