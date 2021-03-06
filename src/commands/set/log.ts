import { Message, TextChannel } from 'discord.js';
import { DJSClient, logger } from '../..';
import { Log } from '../../database';
import { MinecraftLogManager } from '../../managers';
import { SubCommand } from '../../typings';

export default class extends SubCommand {
    private readonly logManager: MinecraftLogManager;

    public constructor(client: DJSClient) {
        super(client, 'log', 'set');
        this.logManager = client.instance.logManager;
    }

    public async run(message: Message, args: string[]): Promise<void | Message> {
        if (!args.length) return message.channel.send(this.parent.command?.usage as string);

        const channelID = args[1]?.replace('<#', '').replace('>', '') ?? message.channel.id;
        const channel = message.guild?.channels.cache.get(channelID) as TextChannel;
        const mes = await channel.send('Configuring...').catch(logger.error);
        if (!mes) return logger.error(`There was an error trying to set channel for log integrations. User: ${message.author.username}(${message.author.id})`);
        const cache = await Log.find({ channelID: channelID });
        const id = args[0] === 'all' ? 0 : Number(args[0]);
        const tmp = cache?.filter(c => c.serverID === id);
        const webhooks = await channel.fetchWebhooks();

        const webhook = webhooks?.filter(w => w.owner === this.client.user).first() ?? await channel.createWebhook('Minecraft');

        if (!cache.length || cache.length && !tmp.length) {
            await new Log({ channelID: channelID, serverID: id }).save();
            this.logManager.addWebhook(id, webhook);
        } else if (tmp.length && cache.length >= tmp.length || cache.find(t => t.serverID === 0)) {
            return mes.edit(`You have already configured for this server ID: ${id === 0 ? args[0] : 'all'}`);
        } else if (cache.length && id === 0) {
            const dbCache = await Log.findOne({ channelID: channelID });
            if (dbCache) {
                dbCache.serverID = id;
                await dbCache.save();
            }
            this.logManager.replaceWebhook(channelID, id, webhook);
        }
        mes.edit('Succesfully configured!');
        channel.send('Please note that the logs may contains *vulnerable* infomations.');
    }
}
