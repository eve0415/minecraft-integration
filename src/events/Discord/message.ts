import { Message } from 'discord.js';
import { DJSClient } from '../..';
import { Chat } from '../../database';
import { Command, DiscordEvent, SendChat } from '../../typings';

export default class extends DiscordEvent {
    private readonly prefix: string;

    public constructor(client: DJSClient) {
        super(client, 'message');
        this.prefix = this.client.config.prefix;
    }

    public async run(message: Message): Promise<void | Message> {
        if (message.system || message.author.bot) return;

        const isCommand = this.isCommand(message.content);

        if (!isCommand) {
            const info = await Chat.find({ channelID: message.channel.id });
            if (!info.length) return;
            if (message.content) {
                const data: SendChat = {
                    name: message.author.username,
                    UUID: null,
                    message: message.content,
                    URL: message.url,
                };
                info.forEach(i => this.client.instance.ws.send(i.serverID, data));
            }
            if (message.attachments.size) {
                const data: SendChat = {
                    name: 'Discord',
                    UUID: null,
                    message: `${message.author.username} sent a message with attachment(s). Click this message to go to the message directly.`,
                    URL: message.url,
                };
                info.forEach(i => this.client.instance.ws.send(i.serverID, data));
            }
            // Sticker (Needs DJS ver.13 for official support)
            // TODO: After djs published djs13 - clean up
            if (!message.content && !message.attachments.size) {
                const data: SendChat = {
                    name: 'Discord',
                    UUID: null,
                    message: `${message.author.username} sent a sticker.`,
                    URL: message.url,
                };
                info.forEach(i => this.client.instance.ws.send(i.serverID, data));
            }
            return;
        }

        const [command, ...args] = message.content
            .toLowerCase()
            .slice(this.prefix.length)
            .split(/(?:"([^"]+)"|([^ ]+)) ?/)
            .filter(e => e);
        const cmd = this.client.commands.get(command) ?? this.client.commands.find(c => c.alias.includes(command)) as Command;

        if (cmd.ownerOnly && message.author.id !== this.client.config.owner) return message.channel.send('You do not have a permission to execute this command');

        if (cmd.hasSubCom) {
            const subCommands = this.client.commands.subCommands.get(command);
            const subCommand = subCommands?.get(args[0]) ?? subCommands?.find(s => s.alias.includes(args[0]));
            if (subCommand) return subCommand.run(message, args.slice(1));
        }

        cmd.run(message, args);
    }

    private isCommand(string: string) {
        if (!string.startsWith(this.prefix)) return false;
        const command = string.toLowerCase()
            .slice(this.prefix.length)
            .split(' ')
            .shift();
        if (!command) return false;
        const cmd = this.client.commands.get(command) ?? this.client.commands.find(c => c.alias.includes(command));
        return !!cmd;
    }
}
