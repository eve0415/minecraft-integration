import { websocketClient } from '../..';
import { ChatData, MinecraftKey, WebsocketEvent } from '../../typings';

export default class extends WebsocketEvent {
    public constructor(client: websocketClient) {
        super(client, 'chat');
    }

    public run(data: ChatData): void {
        data.message = this.client.instance.localizations?.strings.translate[data.message as keyof MinecraftKey['translate']]?.replace('%s', data.name) ?? data.message;

        this.client.instance.chatManager.sendWebhook(data);
    }
}
