import { Message } from 'discord.js';
import Base from './Base';
import { DJSClient } from '..';

type SubCommandOptions = Readonly<{
    alias: string[]
}>;

export abstract class SubCommand extends Base {
    public readonly parent: string;
    public readonly alias: string[];

    public constructor(client: DJSClient, name: string, parent: string, options?: Partial<SubCommandOptions>) {
        super(client, name);

        this.parent = parent;
        this.alias = options?.alias ?? [];
    }

    public abstract run(message: Message, args: string[]): void;
}
