import { MessageEmbed, TextChannel } from 'discord.js';
import { WebhookManager } from './structures';
import { DJSClient, Instance } from '..';
import { database } from '../database';

export class MinecraftLogManager extends WebhookManager {
    private readonly client: DJSClient;

    public constructor(instance: Instance) {
        super();
        this.client = instance.bot;
    }

    public async init(): Promise<void> {
        const cache = database.log.getAll();
        if (!cache) return;
        for (const c of cache) {
            const ch = await this.client.channels.fetch(c.channelID) as TextChannel;
            if (!ch) return database.log.removeCache(c.channelID);
            const webhook = (await ch.fetchWebhooks()).find(w => w.owner === this.client.user);
            if (!webhook) return database.log.removeCache(c.channelID);
            this.addCache(Number(c.serverID), webhook);
        }
    }

    public sendWebhook(id: number, embed: MessageEmbed): void {
        const filtered = this.filter(webhook => webhook.id === id);
        filtered.forEach(w => {
            w.send(embed);
        });
    }
}
