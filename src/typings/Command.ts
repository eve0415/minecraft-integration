import { Message } from 'discord.js';
import { DBase } from './Base';
import { DJSClient } from '..';

type CommandOptions = Readonly<{
    alias: string[]
    description: string
    usage: string
    hasSubcom: boolean
    ownerOnly: boolean
    usedInDM: boolean
}>;

type SubCommandOptions = Readonly<{
    alias: string[]
}>;

export abstract class Command extends DBase {
    public readonly alias: string[];
    public readonly description: string | null;
    public readonly usage: string | null;
    public readonly hasSubcom: boolean;
    public readonly ownerOnly: boolean;
    public readonly usedInDM: boolean;

    public constructor(client: DJSClient, name: string, options?: Partial<CommandOptions>) {
        super(client, name);

        this.alias = options?.alias ?? [];
        this.description = options?.description ?? null;
        this.usage = options?.usage ?? null;
        this.hasSubcom = options?.hasSubcom ?? false;
        this.ownerOnly = options?.ownerOnly ?? false;
        this.usedInDM = options?.usedInDM ?? false;
    }

    public abstract run(message: Message, args: string[]): void;
}

export abstract class SubCommand extends DBase {
    public readonly parent: {name: string, command: Command};
    public readonly alias: string[];

    public constructor(client: DJSClient, name: string, parent: string, options?: Partial<SubCommandOptions>) {
        super(client, name);

        this.parent = { name: parent, command: this.client.commands.get(parent) as Command };
        this.alias = options?.alias ?? [];
    }

    public abstract run(message: Message, args: string[]): void;
}
