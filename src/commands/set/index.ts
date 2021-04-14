import { Message } from 'discord.js';
import { DJSClient } from '../..';
import { Command } from '../../typings';

export default class extends Command {
    public constructor(client: DJSClient) {
        super(client, 'set', {
            description: 'Set channel to use for logging or chatting with minecraft server',
            usage: 'set <status|chat|log> <id|all> [#channel]',
            hasSubCom: true,
            ownerOnly: true,
        });
    }

    public run(message: Message): void {
        message.channel.send(this.usage);
    }
}
