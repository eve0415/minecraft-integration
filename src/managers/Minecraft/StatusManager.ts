import { Message, MessageEmbed, MessageReaction, TextChannel, User } from 'discord.js';
import { DJSClient, Instance, logger } from '../..';
import { database } from '../../database';
import { Status, StatusPage } from '../../status';
import { ServerInfo } from '../../typings';

export class MinecraftStatusManager extends StatusPage {
    private readonly client: DJSClient;
    private one: Message[];
    private multiple: Message[];
    private cache: ServerInfo;

    public constructor(instance: Instance) {
        super();
        this.client = instance.bot;
        this.one = [];
        this.multiple = [];
        this.cache = {};
    }

    public async init(): Promise<void> {
        await super.init();
        const cache = database.status.getMessageCache();
        if (!cache) return;
        for (const c of cache) {
            const ch = await this.client.channels.fetch(c.channelID) as TextChannel;
            if (!ch) return database.status.removeMessage(c.messageID);
            const mes = await ch.messages.fetch(c.messageID).catch(logger.error);
            if (!mes || !this.isValidMessage(mes)) return database.status.removeMessage(c.messageID);
            const footer = toStatusFooter(mes.embeds[0].footer?.text);
            if (footer.Page) {
                await this.addMessage(mes, true);
            } else {
                await this.addMessage(mes);
            }
        }
        await this.refreshAll();
    }

    public async addMessage(msg: Message, multiple = false): Promise<void> {
        if (multiple) {
            this.multiple.push(msg);
            await msg.reactions.removeAll();
            if (this.size > 1) await msg.react('◀️').then(() => msg.react('▶️'));
            this.createReactionCollector(msg);
        } else {
            this.one.push(msg);
        }
    }

    private createReactionCollector(msg: Message) {
        const filter = (_reaction: MessageReaction, user: User) => user !== this.client.user;
        const collector = msg.createReactionCollector(filter);
        collector.on('collect', (reaction, user) => this.handleReaction(reaction, user));
    }

    private async handleReaction(reaction: MessageReaction, user: User) {
        if (!(reaction.emoji.name === '◀️' || reaction.emoji.name === '▶️')) return reaction.users.remove(user);

        const footer = toStatusFooter(reaction.message.embeds[0].footer?.text);
        const page = Number(footer.Page?.split('/')[0] ?? '0');
        const nextPage = reaction.emoji.name === '◀️' ? page - 1 <= 0 ? this.size : page - 1 : page + 1 > this.size ? 1 : page + 1;

        await reaction.message
            .fetch(true)
            .then(mes => mes
                .edit(this.getPage({ page: nextPage }))
                .then(() => reaction.users.remove(user)));
    }

    private isValidMessage(msg: Message) {
        return msg.embeds.length === 1;
    }

    public async refreshStatus(id?: number): Promise<void> {
        if (!id) await this.refreshAll();

        const one = this.one
            .map(async mes => {
                if (!this.isValidMessage(mes)) {
                    this.one = this.one.filter(m => m.id !== mes.id);
                    return database.status.removeMessage(mes.id);
                }
                const data = toStatusFooter(mes.embeds[0].footer?.text);
                await mes.fetch(true);
                if (data.ID === id?.toString()) return mes.edit(this.get(Number(data.ID))?.embed ?? '').catch(logger.error);
                return 0;
            });

        const multiple = this.multiple.map(async mes => {
            if (!this.isValidMessage(mes)) {
                this.multiple = this.multiple.filter(m => m.id !== mes.id);
                return database.status.removeMessage(mes.id);
            }
            const data = toStatusFooter(mes.embeds[0].footer?.text);
            const now = data.Page?.split('/').shift();
            await mes.fetch(true);
            if (data.ID === id?.toString()) return mes.edit(this.getPage({ page: Number(now) })).catch(logger.error);
            return 0;
        });

        await Promise.all([one, multiple]);
    }

    private async refreshAll() {
        const one = this.one.map(mes => {
            if (!this.isValidMessage(mes)) {
                this.one = this.one.filter(m => m.id !== mes.id);
                return database.status.removeMessage(mes.id);
            }
            const data = toStatusFooter(mes.embeds[0].footer?.text);
            return mes.edit(this.getPage({ page: Number(data.ID) })).catch(logger.error);
        });

        const multiple = this.multiple.map(mes => {
            if (!this.isValidMessage(mes)) {
                this.multiple = this.multiple.filter(m => m.id !== mes.id);
                return database.status.removeMessage(mes.id);
            }
            const data = toStatusFooter(mes.embeds[0].footer?.text);
            const now = data.Page?.split('/').shift();
            return mes.edit(this.getPage({ page: Number(now) })).catch(logger.error);
        });

        await Promise.all([one, multiple]);
    }

    public getPage(d: AtLeastOne<PageOrID>): MessageEmbed {
        if (d.id) return this.get(d.id)?.embed.setFooter(`ID: ${d.id}`) ?? this.getUnknown(d.id);
        if (d.page) {
            const status = this.array()[d.page - 1];
            const fallback = this.first();
            return status?.embed.setFooter(`ID: ${status.id} Page: ${d.page}/${this.size}`) ?? fallback?.embed.setFooter(`ID: ${fallback.id} Page: 1/${this.size}`);
        }
        // This should never happen
        return new MessageEmbed().setTitle('Error while fetching status').setColor('RED');
    }

    public addStatus(id: number, type: string): Status {
        const result = super.addStatus(id, type);
        if (!result) return result;
        Object.keys(this.cache).forEach(port => {
            if (port === result?.id) result.setName(this.cache[port]);
        });

        if (this.size === 2) {
            const multiple = this.multiple.map(mes => {
                if (!this.isValidMessage(mes)) {
                    this.multiple = this.multiple.filter(m => m.id !== mes.id);
                    return database.status.removeMessage(mes.id);
                }
                return mes.reactions.removeAll();
            });
            Promise.all([multiple, this.refreshAll()]);
        }

        return result;
    }

    public cacheUnknownServer(data: ServerInfo): void {
        this.cache = data;
    }

    public async shutdown(): Promise<void> {
        const one = this.one.map(mes => {
            if (!this.isValidMessage(mes)) {
                this.one = this.one.filter(m => m.id !== mes.id);
                return database.status.removeMessage(mes.id);
            }
            const embed = new MessageEmbed()
                .setDescription(`${this.client.user?.toString()} is offline`)
                .setColor('BLACK')
                .setFooter(mes.embeds[0].footer?.text);
            return mes.edit(embed).catch(logger.error);
        });

        const multiple = this.multiple.map(mes => {
            if (!this.isValidMessage(mes)) {
                this.multiple = this.multiple.filter(m => m.id !== mes.id);
                return database.status.removeMessage(mes.id);
            }
            const embed = new MessageEmbed()
                .setDescription(`${this.client.user?.toString()} is offline`)
                .setColor('BLACK')
                .setFooter(mes.embeds[0].footer?.text);
            return mes.reactions.removeAll().then(() => mes.edit(embed)).catch(logger.error);
        });
        await Promise.all([one, multiple]);
    }
}

const toStatusFooter = (str?: string): statusEmbedFooter => {
    if (!str) return { ID: '0' };
    const args = str.split(' ');
    return { ID: args[1], Page: args[3] };
};

type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];

interface statusEmbedFooter {
    ID: string
    Page?: string
}

interface PageOrID {
    page: number,
    id: number
}
