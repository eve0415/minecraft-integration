import { websocketClient } from '../..';
import { ChatData, WebsocketEvent } from '../../typings';

export default class extends WebsocketEvent {
    public constructor(client: websocketClient) {
        super(client, 'advancementAchieve');
    }

    public run(data: ChatData): void {
        const isVanilla = this.client.instance.localizations?.strings.advancements[data.message] as string;
        const message = `${data.name} has made the advancement **[${isVanilla ? isVanilla : data.message}]**`;
        this.client.instance.chatManager.sendWebhook({ port: data.port, name: data.name, UUID: data.UUID, message: message });
    }
}
