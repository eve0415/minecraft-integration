import { MessageEmbed } from 'discord.js';
import { getStatusEmbed } from './statusTemplate';
import { logger } from '../logger';
import { StatusData, statusEmbedType } from '../typings';

export class StatusPage {
    private readonly pages: Status[];

    constructor() {
        this.pages = [];
    }

    public addStatus(id: number, type: string): void {
        if (this.pages.find(page => page.id === id)) return logger.error(`Cannot add new status page because of conflict ID ${id}`);
        this.pages.push(new Status(id, type));
        this.pages.sort((p1, p2) => p1.id > p2.id ? 1 : -1);
    }

    public updateStatus(id: number, status: statusEmbedType, data: StatusData): void {
        const page = this.pages.find(p => p.id === Number(id));
        if (!page) return logger.error(`Cannot update status ID ${id} because of unknown`);
        page.updateStatus(status, data);
    }

    public setName(id: number, name: string): void {
        const page = this.pages.find(p => p.id === Number(id));
        if (!page) return logger.error(`Cannot set name for status ID ${id} because of unknown`);
        page.setName(name);
    }

    public getPage(id: number): MessageEmbed {
        return this.pages.find(p => p.id === id)?.embed.setFooter(`ID: ${id}`) ?? getStatusEmbed('UNKNOWN', { id: id });
    }

    public getAllPages(): Status[] {
        return this.pages;
    }
}

class Status {
    public readonly id: number;
    private name: string;
    public embed: MessageEmbed;

    constructor(id: number, type: string) {
        this.id = id;
        this.name = type;
        this.embed = getStatusEmbed('OFFLINE', { name: this.name });
    }

    public updateStatus(st: statusEmbedType, data: StatusData) {
        this.embed = getStatusEmbed(st, { data: data, name: this.name });
    }

    public setName(name: string) {
        this.name = name;
        this.embed.setTitle(name);
    }
}

module.exports = new StatusPage();
