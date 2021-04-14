import { websocketClient } from '../..';
import { ChatData, MinecraftKey, WebsocketEvent } from '../../typings';

export default class extends WebsocketEvent {
    public constructor(client: websocketClient) {
        super(client, 'advancementAchieve');
    }

    public run(data: ChatData): void {
        const message = `${data.name} has made the advancement **[${this.client.instance.localizations?.strings.advancements[data.message as keyof MinecraftKey['advancements']] ?? data.message}]**`;
        this.client.instance.chatManager.sendWebhook({ serverId: data.serverId, name: data.name, UUID: data.UUID, message: message });
    }
}
