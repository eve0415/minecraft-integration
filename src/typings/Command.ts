import { Message } from 'discord.js';
import Base from './Base';
import { DJSClient } from '..';

export type CommandOptions = Readonly<{
    alias: string[]
    ownerOnly: boolean
    usedInDM: boolean
}>;

export abstract class Command extends Base {
    public readonly alias: string[];
    public readonly ownerOnly: boolean;
    public readonly usedInDM: boolean;

    public constructor(client: DJSClient, name: string, options?: Partial<CommandOptions>) {
        super(client, name);

        this.alias = options?.alias ?? [];
        this.ownerOnly = options?.ownerOnly ?? false;
        this.usedInDM = options?.usedInDM ?? false;
    }

    public abstract run(message: Message, args: string[]): void;
}
