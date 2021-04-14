import { Message } from 'discord.js';
import { DJSClient } from '../..';
import { Server } from '../../database';
import { SubCommand } from '../../typings';

export default class extends SubCommand {
    public constructor(client: DJSClient) {
        super(client, 'list', 'database');
    }

    public async run(message: Message): Promise<void | Message> {
        const servers = await Server.find();
        message.channel.send({ embed: { description: servers.map(s => `-${s.name}: ${s.serverID}`).join('\n'), color: 'BLUE' } });
    }
}
