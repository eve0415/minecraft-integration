import { websocketClient } from '../..';
import { ChatData, WebsocketEvent } from '../../typings';

export default class extends WebsocketEvent {
    public constructor(client: websocketClient) {
        super(client, 'chat');
    }

    public run(data: ChatData): void {
        this.client.instance.chatManager.sendWebhook(data);
    }
}
