import { Message, TextChannel } from 'discord.js';
import { DJSClient } from '../..';
import { MinecraftLogManager } from '../../Managers';
import { database } from '../../database';
import { SubCommand } from '../../typings';

export default class extends SubCommand {
    private readonly logManager: MinecraftLogManager;

    public constructor(client: DJSClient) {
        super(client, 'log', 'set');
        this.logManager = client.instance.logManager;
    }

    public async run(message: Message, args: string[]): Promise<void|Message> {
        if (!args.length) return message.channel.send(this.parent.command.usage as string);

        const channelID = args[1].replace('<#', '').replace('>', '') ?? message.channel.id;
        const channel = message.guild?.channels.cache.get(channelID) as TextChannel;
        const mes = await channel.send('Configuring...');
        const cache = database.log.getFromID(channelID);
        const id = args[0] === 'all' ? 0 : Number(args[0]);
        const tmp = cache?.filter(c => c.serverID === id);
        const webhooks = await channel.fetchWebhooks();

        const webhook = webhooks?.filter(w => w.owner === this.client.user).first() ?? await channel.createWebhook('Minecraft');

        if (!cache.length || cache.length && !tmp.length) {
            database.log.addCache(channelID, id);
            this.logManager.addWebhook(id, webhook);
        } else if (tmp.length && cache.length >= tmp.length || cache.find(t => t.serverID === 0)) {
            return mes.edit(`You have already configured for this server ID: ${id === 0 ? args[0] : 'all'}`);
        } else if (cache.length && id === 0) {
            database.log.removeCache(channelID);
            database.log.addCache(channelID, id);
            this.logManager.replaceWebhook(channelID, id, webhook);
        }
        mes.edit('Succesfully configured!');
        channel.send('Please note that the logs may contains *vulnerable* infomations.');
    }
}
