import { Message } from 'discord.js';
import { DBase } from './Base';
import { DJSClient } from '..';

type CommandOptions = Readonly<{
    alias?: string[]
    description: string
    usage: string
    hasSubCom?: boolean
    ownerOnly?: boolean
    usedInDM?: boolean
}>;

type SubCommandOptions = Readonly<{
    alias: string[]
}>;

export abstract class Command extends DBase {
    public readonly alias: string[];
    public readonly description: string;
    public readonly usage: string;
    public readonly hasSubCom: boolean;
    public readonly ownerOnly: boolean;
    public readonly usedInDM: boolean;

    public constructor(client: DJSClient, name: string, options: CommandOptions) {
        super(client, name);

        this.alias = options.alias ?? [];
        this.description = options.description;
        this.usage = options.usage;
        this.hasSubCom = options?.hasSubCom ?? false;
        this.ownerOnly = options?.ownerOnly ?? false;
        this.usedInDM = options?.usedInDM ?? false;
    }

    public abstract run(message: Message, args: string[]): void;
}

export abstract class SubCommand extends DBase {
    public readonly parent: {name: string, command: Command | null};
    public readonly alias: string[];

    public constructor(client: DJSClient, name: string, parent: string, options?: Partial<SubCommandOptions>) {
        super(client, name);
        this.parent = { name: parent, command: null };
        this.alias = options?.alias ?? [];
    }

    public subscribeParent(parentName: string): void {
        this.parent.command = this.client.commands.get(parentName) as Command;
    }

    public abstract run(message: Message, args: string[]): void;
}
