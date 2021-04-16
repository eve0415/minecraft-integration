import { Message, MessageEmbed, TextChannel, Webhook } from 'discord.js';
import { DJSClient, Instance } from '../..';
import { Log } from '../../database';
import { WebhookManager } from '../structures';

export class MinecraftLogManager extends WebhookManager {
    private readonly client: DJSClient;

    public constructor(instance: Instance) {
        super();
        this.client = instance.bot;
    }

    public async init(): Promise<void> {
        const cache = await Log.find();
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
        filtered.forEach(w => w.send(embed));
    }

    private async start() {
        const embed = new MessageEmbed().setTitle('Waking up bot...').setColor('GREEN');
        await Promise.all(this.map(w => w.send(embed)));
    }

    public shutdown(): Promise<(Message | Message[] | undefined)[]> {
        const embed = new MessageEmbed().setTitle('Bot shutting down...').setColor('BLACK');
        return Promise.all(this.map(w => w.send(embed)));
    }
}
