import { Message } from 'discord.js';
import { DBase } from './Base';
import { DJSClient } from '..';

type CommandOptions = Readonly<{
    alias: string[]
    hasSubcom: boolean
    ownerOnly: boolean
    usedInDM: boolean
}>;

export abstract class Command extends DBase {
    public readonly alias: string[];
    public readonly hasSubcom: boolean;
    public readonly ownerOnly: boolean;
    public readonly usedInDM: boolean;

    public constructor(client: DJSClient, name: string, options?: Partial<CommandOptions>) {
        super(client, name);

        this.alias = options?.alias ?? [];
        this.hasSubcom = options?.hasSubcom ?? false;
        this.ownerOnly = options?.ownerOnly ?? false;
        this.usedInDM = options?.usedInDM ?? false;
    }

    public abstract run(message: Message, args: string[]): void;
}
