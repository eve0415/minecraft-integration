import { Message, MessageEmbed, TextChannel, Webhook } from 'discord.js';
import { DJSClient, Instance } from '../..';
import { database } from '../../database';
import { WebhookManager } from '../structures';

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
        await this.start();
    }

    public addWebhook(id: number, webhook: Webhook): void {
        this.addCache(id, webhook);
    }

    public replaceWebhook(channelID: string, id: number, webhook: Webhook): void {
        this.filter(w => w.webhook.channelID !== channelID);
        this.addCache(id, webhook);
    }

    public sendWebhook(id: number, embed: MessageEmbed): void {
        const filtered = this.filter(webhook => webhook.id === id || webhook.id === 0);
        filtered.forEach(w => {
            w.send(embed);
        });
    }

    private async start(): Promise<void> {
        const embed = new MessageEmbed().setTitle('Waking up bot...').setColor('GREEN');
        const toDo = this.map(w => w.send(embed));
        await Promise.all(toDo);
    }

    public shutdown(): Promise<(Message | Message[] | undefined)[]> {
        const embed = new MessageEmbed().setTitle('Bot shutting down...').setColor('BLACK');
        const toDo = this.map(w => w.send(embed));
        return Promise.all(toDo);
    }
}
