import { Message, TextChannel } from 'discord.js';
import { DJSClient, logger } from '../..';
import { Chat } from '../../database';
import { MinecraftChatManager } from '../../managers';
import { SubCommand } from '../../typings';

export default class extends SubCommand {
    private readonly chatManager: MinecraftChatManager;

    public constructor(client: DJSClient) {
        super(client, 'chat', 'set');
        this.chatManager = client.instance.chatManager;
    }

    public async run(message: Message, args: string[]): Promise<void | Message> {
        if (!args.length) return message.channel.send(this.parent.command?.usage as string);

        const channelID = args[1]?.replace('<#', '').replace('>', '') ?? message.channel.id;
        const channel = message.guild?.channels.cache.get(channelID) as TextChannel;
        const mes = await channel.send('Configuring...').catch(logger.error);
        if (!mes) return logger.error(`There was an error trying to set channel for chat integrations. User: ${message.author.username}(${message.author.id})`);
        if (args[0] === 'all') return mes.edit('You cannot choose `all` server for chatting');

        const id = Number(args[0]);
        const cache = await Chat.find({ channelID: channelID });
        if (cache?.filter(c => c.serverID === id).length) return mes.edit(`You have already configured for this server ID: ${args[0]}`);

        const webhooks = await channel.fetchWebhooks();
        const webhook = webhooks?.filter(w => w.owner === this.client.user).first() ?? await channel.createWebhook('Minecraft');

        this.chatManager.add(id, webhook);
        await new Chat({ channelID: channelID, serverID: id }).save();
        mes.edit('Succesfully configured!');
    }
}
