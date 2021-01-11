import { Message, MessageEmbed, MessageReaction, TextChannel, User } from 'discord.js';
import { DJSClient, Instance, logger } from '../..';
import { database } from '../../database';
import { StatusPage } from '../../status';

export class MinecraftStatusManager extends StatusPage {
    private readonly client: DJSClient;
    private one: Message[];
    private multiple: Message[];

    public constructor(instance: Instance) {
        super();
        this.client = instance.bot;
        this.one = [];
        this.multiple = [];
    }

    public async init(): Promise<void> {
        await super.init();
        const cache = database.status.getMessageCache();
        if (!cache) return;
        for (const c of cache) {
            const ch = await this.client.channels.fetch(c.channelID) as TextChannel;
            if (!ch) return database.status.removeMessage(c.messageID);
            const mes = await ch.messages.fetch(c.messageID);
            if (!mes || !this.isValidMessage(mes)) return database.status.removeMessage(c.messageID);
            const footer = mes.embeds[0].footer?.text as unknown as statusEmbedFooter;
            if (footer.Page) {
                await this.addMessage(mes, true);
            } else {
                await this.addMessage(mes);
            }
        }
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

        const footer = reaction.message.embeds[0].footer?.text as unknown as statusEmbedFooter;
        const page = footer.Page?.split('/')[0] ?? 0;
        let nextPage: number;
        if (reaction.emoji.name === '◀️') {
            nextPage = Number(page) - 1 <= 0 ? this.size : Number(page) - 1;
        } else {
            nextPage = Number(page) + 1 > this.size ? 1 : Number(page) + 1;
        }

        await reaction.message
            .edit(this.array()[nextPage])
            .then(() => reaction.users.remove(user));
    }

    private isValidMessage(msg: Message): boolean {
        return msg.embeds.length === 1;
    }

    public refreshStatus(): void {
        this.one.forEach(async mes => {
            if (!this.isValidMessage(mes)) {
                this.one = this.one.filter(m => m.id !== mes.id);
                return database.status.removeMessage(mes.id);
            }
            const data = mes.embeds[0].footer?.text as unknown as statusEmbedFooter;

            await mes.edit(this.get(Number(data.ID))?.embed ?? '').catch(logger.error);
        });

        this.multiple.forEach(async mes => {
            if (!this.isValidMessage(mes)) {
                this.multiple = this.multiple.filter(m => m.id !== mes.id);
                return database.status.removeMessage(mes.id);
            }
            const data = mes.embeds[0].footer?.text as unknown as statusEmbedFooter;

            const now = data.Page?.split('/').shift();
            await mes.edit(this.getPage({ page: Number(now) - 1 })).catch(logger.error);
        });
    }

    public getPage(d: AtLeastOne<PageOrID>): MessageEmbed {
        if (d.id) return this.get(d.id)?.embed ?? this.getUnknown(d.id);
        if (d.page) {
            const status = this.array()[d.page];
            const fallback = this.first();
            return status.embed.setFooter(`ID: ${status.id} Page: ${d.page}/${this.size}`) ?? fallback?.embed.setFooter(`ID: ${fallback.id} Page: 1/${this.size}`);
        }
        // This should never happen
        return new MessageEmbed().setTitle('Error while fetching status').setColor('RED');
    }
}

type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];

interface statusEmbedFooter {
    ID: string
    Page?: string
}

interface PageOrID {
    page: number,
    id: number
}
