import { Message } from 'discord.js';
import { DJSClient } from '../..';
import { Server } from '../../database';
import { SubCommand } from '../../typings';

export default class extends SubCommand {
    public constructor(client: DJSClient) {
        super(client, 'delete', 'database', { alias: ['del', 'remove', 'rem'] });
    }

    public async run(message: Message, args: string[]): Promise<void | Message> {
        const servers = await Server.findOne({ serverID: Number(args[0]) });
        if (servers) {
            await servers.remove();
            message.channel.send({ embed: { description: 'Successfully removed', color: 'BLUE' } });
        } else {
            message.channel.send({ embed: { description: 'Failed to find', color: 'RED' } });
        }
    }
}
