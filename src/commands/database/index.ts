import { Message } from 'discord.js';
import { DJSClient } from '../..';
import { Command } from '../../typings';

export default class extends Command {
    public constructor(client: DJSClient) {
        super(client, 'database', {
            description: 'Check | Delete database data',
            usage: 'database < list | delete <ID> >',
            alias: ['db'],
            ownerOnly: true,
        });
    }

    public run(message: Message): void {
        message.channel.send(this.usage);
    }
}
