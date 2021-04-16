import { TextChannel, Webhook, WebhookMessageOptions } from 'discord.js';
import { DJSClient, Instance } from '../..';
import { Chat } from '../../database';
import { ChatData } from '../../typings';
import { WebhookManager } from '../structures';

export class MinecraftChatManager extends WebhookManager {
    private readonly client: DJSClient;

    public constructor(instance: Instance) {
        super();
        this.client = instance.bot;
    }

    public async init(): Promise<void> {
        const cache = await Chat.find();
        if (!cache) return;
        for (const c of cache) {
            const ch = this.client.channels.resolve(c.channelID) as TextChannel;
            const webhook = (await ch?.fetchWebhooks()).find(w => w.owner === this.client.user);
            if (!webhook) {
                await c.remove();
                continue;
            }
            this.addCache(Number(c.serverID), webhook);
        }
    }

    public add(id: number, webhook: Webhook): void {
        this.addCache(id, webhook);
    }

    public sendWebhook(data: ChatData): void {
        const filtered = this.filter(webhook => webhook.id === data.serverId);
        filtered.forEach(w => {
            w.send(data.message, {
                username: data.name,
                avatarURL: data.UUID ? `https://crafatar.com/avatars/${data.UUID}` : null,
            } as WebhookMessageOptions);
        });
    }
}
