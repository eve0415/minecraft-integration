import { TextChannel, WebhookMessageOptions } from 'discord.js';
import { WebhookManager } from './structures';
import { DJSClient, Instance } from '..';
import { database } from '../database';
import { ChatData } from '../typings';

export class MinecraftChatManager extends WebhookManager {
    private readonly client: DJSClient;

    public constructor(instance: Instance) {
        super();
        this.client = instance.bot;
    }

    public async init(): Promise<void> {
        const cache = database.chat.getAll();
        if (!cache) return;
        for (const c of cache) {
            const ch = await this.client.channels.fetch(c.channelID) as TextChannel;
            if (!ch) return database.chat.removeCache(c.channelID);
            const webhook = (await ch.fetchWebhooks()).find(w => w.owner === this.client.user);
            if (!webhook) return database.chat.removeCache(c.channelID);
            this.addCache(Number(c.serverID), webhook);
        }
    }

    public sendWebhook(data: ChatData): void {
        const filtered = this.filter(webhook => webhook.id === data.port);
        filtered.forEach(w => {
            w.send(data.message, {
                username: data.name,
                avatarURL: data.UUID ? `https://crafatar.com/avatars/${data.UUID}` : null,
            } as WebhookMessageOptions);
        });
    }
}
