import { Collection, MessageEmbed } from 'discord.js';
import { getStatusEmbed } from './statusTemplate';
import { database } from '../database';
import { logger } from '../logger';
import { StatusData, StatusEmbedType } from '../typings';

export class StatusPage extends Collection<number, Status> {
    public init(): Promise<void> {
        return new Promise(resolve => {
            logger.info('Initializing status page');
            logger.info('Retrieving from cache data');

            const cache = database.server.getAllServer();
            if (!cache) return resolve();
            for (const c of cache) {
                const s = this.addStatus(c.ID, c.type);
                if (c.name) s?.setName(c.name);
            }

            logger.info(`${this.size} status has been cached!`);
            resolve();
        });
    }

    public addStatus(id: number, type: string): Status {
        if (this.has(id)) {
            logger.error(`Cannot add new status page because of conflict ID ${id}`);
            logger.warn('Status will be over written');
            return this.get(id) as Status;
        }
        const status = new Status(id, type);
        this.set(id, status);
        this.sort((p1, p2) => p1.id > p2.id ? 1 : -1);
        return status;
    }

    public updateStatus(id: number, status: StatusEmbedType, data: StatusData): void {
        const page = this.get(id);
        if (!page) return logger.error(`Cannot update status ID ${id} because of unknown status`);
        page.updateStatus(status, data);
    }

    public setName(id: number, name: string): void {
        const page = this.get(id);
        if (!page) return logger.error(`Cannot set name for status ID ${id} because of unknown status`);
        page.setName(name);
    }

    public getUnknown(id: number): MessageEmbed {
        return getStatusEmbed('UNKNOWN', { id: id });
    }
}

export class Status {
    public readonly id: number;
    private name: string;
    public embed: MessageEmbed;

    constructor(id: number, type: string) {
        this.id = id;
        this.name = type;
        this.embed = getStatusEmbed('OFFLINE', { name: this.name, id: this.id });
    }

    public updateStatus(st: StatusEmbedType, data: StatusData): void {
        this.embed = getStatusEmbed(st, { data: data, name: this.name, id: this.id });
    }

    public setName(name: string): void {
        this.name = name;
        this.embed.setTitle(name);
    }
}
