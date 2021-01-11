import { Message } from 'discord.js';
import { DJSClient } from '../..';
import { DiscordEvent } from '../../typings';

export default class extends DiscordEvent {
    private readonly prefix: string;

    public constructor(client: DJSClient) {
        super(client, 'message');
        this.prefix = this.client.config.prefix;
    }

    public run(message: Message): void | Promise<Message> {
        if (message.system || message.author.bot) return;
        if (!message.content.startsWith(this.prefix)) return;

        const [command, ...args] = message.content.toLowerCase().slice(this.prefix.length).split(' ');
        const cmd = this.client.commands.get(command) ?? this.client.commands.find(c => c.alias.includes(command));
        if (!cmd) return;

        if (cmd.ownerOnly && message.author.id !== this.client.config.owner) return message.channel.send('You do not have a permission to execute this command');

        if (cmd.hasSubcom) {
            const subCommands = this.client.commands.subCommands.get(command);
            const subCommand = subCommands?.get(args[0]) ?? subCommands?.find(s => s.alias.includes(args[0]));
            if (subCommand) return subCommand.run(message, args.slice(1));
        }

        cmd.run(message, args);
    }
}
