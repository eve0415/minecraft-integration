import { Message, Role, TextChannel } from 'discord.js';
import { DJSClient } from '../..';
import { MinecraftStatusManager } from '../../Managers';
import { database } from '../../database';
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
        const mes = await channel.send('Configuring...');

        await channel.updateOverwrite(message.guild?.roles.everyone as Role, { SEND_MESSAGES: false });
        database.status.addMessageCache(channelID, mes.id);

        if (args[0] !== 'all') {
            mes.edit('', this.statusManager.getPage({ page: Number(args[0]) }));
            this.statusManager.addMessage(mes);
        } else {
            await mes.edit('', this.statusManager.getPage({ page: 1 }));
            this.statusManager.addMessage(mes, true);
        }
    }
}
