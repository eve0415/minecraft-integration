import { Message, Role, TextChannel } from 'discord.js';
import { DJSClient, logger } from '../..';
import { database } from '../../database';
import { MinecraftStatusManager } from '../../managers';
import { SubCommand } from '../../typings';

export default class extends SubCommand {
    private readonly statusManager: MinecraftStatusManager;

    public constructor(client: DJSClient) {
        super(client, 'status', 'set');
        this.statusManager = client.instance.statusManager;
    }

    public async run(message: Message, args: string[]): Promise<void | Message> {
        if (!args.length) return message.channel.send(this.parent.command?.usage as string);

        const channelID = args[1]?.replace('<#', '').replace('>', '') ?? message.channel.id;
        const channel = message.guild?.channels.cache.get(channelID) as TextChannel;
        const mes = await channel.send('Configuring...').catch(logger.error);
        if (!mes) return logger.error(`There was an error trying to set message for status embeds. User: ${message.author.username}(${message.author.id})`);

        await channel.updateOverwrite(message.guild?.roles.everyone as Role, { SEND_MESSAGES: false });
        database.status.addMessageCache(channelID, mes.id);

        if (args[0] !== 'all') {
            mes.edit('', this.statusManager.getPage({ id: Number(args[0]) }));
            this.statusManager.addMessage(mes);
        } else {
            const embed = this.statusManager.getPage({ page: 1 });
            if (!embed) return mes.edit('No status found! Try to start and connect to minecraft server and retry the command');
            await mes.edit('', embed);
            this.statusManager.addMessage(mes, true);
        }
    }
}
