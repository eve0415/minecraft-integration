import { SimpleProject } from 'aio-mc-api';
import { Message, MessageEmbed, MessageReaction, User, Util } from 'discord.js';
import { DJSClient } from '..';

export class SearchManager {
    private readonly client: DJSClient;
    private readonly user: User;
    private readonly message: Message;
    private readonly projects: SimpleProject[];
    private readonly reactions = ['◀️', '▶️', 'ℹ️', '📁'];
    private readonly now = { project: 1, description: 0, file: 1 };
    private mode: 'Project' | 'Description' | 'File' = 'Project';
    private cacheDescription: string[] = [];

    constructor(client: DJSClient, user: User, message: Message, projects: SimpleProject[]) {
        this.client = client;
        this.user = user;
        this.message = message;
        this.projects = projects;
    }

    private get page(): number {
        return this.projects.length;
    }

    private get descSize(): number {
        return this.cacheDescription.length;
    }

    private get fileSize(): number {
        return this.projects[this.now.project - 1].files.length;
    }

    private async getPage() {
        const project = this.projects[this.now.project - 1];

        if (this.mode === 'Project') {
            return new MessageEmbed()
                .setTitle(project.name)
                .setURL(project.url)
                .setDescription(project.summary)
                .setThumbnail(project.attachments.find(a => a.isDefault)?.thumbnailUrl ?? '')
                .setColor('BLUE')
                .addField('Authors', project.authors.map(c => `[${c.name}](${c.url})`).join(', '))
                .addField('Categories', project.categories.map(c => `[${c.name}](${c.url})`).join(', '))
                .addField('Version',
                    project.files
                        .flatMap(f => f.gameVersion)
                        .filter((c, i, arr) => arr.indexOf(c) === i)
                        .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))
                        .join(', '))
                .addField('Available', project.isAvailable ? 'Yes' : 'No', true)
                .addField('Featured', project.isFeatured ? 'Yes' : 'No', true)
                .addField('Ranking', project.popularityRank, true)
                .setFooter(`ID: ${project.id} Page: ${this.now.project}/${this.page}`);
        } else if (this.mode === 'Description') {
            if (this.now.description === 0) {
                this.cacheDescription = Util.splitMessage(await project.getDescription(), { maxLength: 2048 });
                this.now.description = 1;
            }
            return new MessageEmbed()
                .setTitle(project.name)
                .setURL(project.url)
                .setDescription(this.cacheDescription[this.now.description - 1])
                .setThumbnail(project.attachments.find(a => a.isDefault)?.thumbnailUrl ?? '')
                .setColor('BLUE')
                .setFooter(`ID: ${project.id} Page: ${this.now.description}/${this.descSize}`);
        } else {
            const file = project.files[this.now.file - 1];
            if (file.partial) await file.fetch();
            return new MessageEmbed()
                .setAuthor(project.name, project.attachments.find(a => a.isDefault)?.thumbnailUrl ?? '', project.url)
                .setTitle(file.name)
                .setURL(file.url ?? '')
                .setDescription(Util.splitMessage(await file.getChangelog(), { maxLength: 2048 })[0])
                .setColor('BLUE')
                .addField('Version', file.gameVersion.sort((a, b) => b.localeCompare(a, undefined, { numeric: true })).join(', '))
                .addField('Latest', file.isLatest ? 'Yes' : 'NO', true)
                .addField('Available', file.isAvailable ? 'Yes' : 'No', true)
                .addField('Server Pack', file.isServerPack ? 'Yes' : 'No', true)
                .addField('Size', file.size, true)
                .addField('Released', `${file.date?.getFullYear()}/${file.date?.getMonth() as number + 1}/${file.date?.getDay()}`, true)
                .setFooter(`ID: ${project.id} Page: ${this.now.file}/${this.fileSize}`);
        }
    }

    public async initialize(): Promise<void> {
        await this.message.edit(await this.getPage());
        await Promise.all(this.reactions.map(m => this.message.react(m)));
        const filter = (_reaction: MessageReaction, user: User) => user !== this.client.user;
        const collector = this.message.createReactionCollector(filter, { dispose: true, idle: 180000 });
        collector.on('collect', (reaction, user) => this.onReaction(reaction, user));
        collector.on('remove', reaction => this.onRemoveReaction(reaction));
        collector.on('end', () => this.onEnd());
    }

    private async onReaction(reaction: MessageReaction, user: User) {
        const emoji = reaction.emoji.name;
        if (this.user !== user) return reaction.users.remove(user);
        if (!this.reactions.includes(emoji)) return reaction.users.remove(user);
        if (['◀️', '▶️'].includes(emoji)) {
            await this.changePage(emoji === '◀️' ? -1 : 1);
            await reaction.users.remove(user);
        }
        if (emoji === 'ℹ️') {
            if (this.mode === 'File') this.message.reactions.resolve('📁')?.users.remove(user);
            await this.changeMode('Description');
        }
        if (emoji === '📁') {
            if (this.mode === 'Description') this.message.reactions.resolve('ℹ️')?.users.remove(user);
            await this.changeMode('File');
        }
    }

    private async onRemoveReaction(reaction: MessageReaction) {
        const emoji = reaction.emoji.name;
        if (!['ℹ️', '📁'].includes(emoji)) return;
        if (emoji === 'ℹ️' && this.message.reactions.resolve('📁')?.count === 1) await this.changeMode('Description');
        if (emoji === '📁' && this.message.reactions.resolve('ℹ️')?.count === 1) await this.changeMode('File');
    }

    private onEnd() {
        this.message.reactions.removeAll();
    }

    private async changePage(to: number) {
        if (this.mode === 'Project') {
            if (this.page === 1) return;
            this.now.project = to === -1 ?
                this.now.project === 1 ? this.page : this.now.project - 1 :
                this.now.project === this.page ? 1 : this.now.project + 1;
            this.now.description = 0;
            this.now.file = 1;
        } else if (this.mode === 'Description') {
            if (this.descSize === 1) return;
            this.now.description = to === -1 ?
                this.now.description === 1 ? this.descSize : this.now.description - 1 :
                this.now.description === this.descSize ? 1 : this.now.description + 1;
        } else {
            if (this.fileSize === 1) return;
            this.now.file = to === -1 ?
                this.now.file === 1 ? this.fileSize : this.now.file - 1 :
                this.now.file === this.fileSize ? 1 : this.now.file + 1;
        }
        await this.message.edit(await this.getPage());
    }

    private async changeMode(mode: 'Description' | 'File') {
        this.mode = mode === 'Description' ?
            this.mode === 'Description' ? 'Project' : 'Description' :
            this.mode === 'File' ? 'Project' : 'File';
        await this.message.edit(await this.getPage());
    }
}
