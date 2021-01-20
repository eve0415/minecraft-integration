import { resolve } from 'path';
import { Collection } from 'discord.js';
import { SubCommandManager } from './SubCommandManager';
import { ModuleData, ModuleManager } from './structures';
import { DJSClient, logger, websocketClient } from '..';
import { Command, SubCommand } from '../typings';

export class CommandManager extends ModuleManager<string, Command> {
    public readonly subCommands: Collection<string, SubCommandManager>;

    public constructor(client: DJSClient | websocketClient) {
        super(client);
        this.subCommands = new Collection();
    }

    public register(data: ModuleData<string, Command>): Command {
        logger.info(`Registering command: ${data.key}`);
        return super.register(data);
    }

    public unregister(name: string): Command {
        logger.info(`Unregistering command: ${name}`);
        return super.unregister(name);
    }

    public async registerAll(): Promise<void> {
        logger.info('Trying to register all commands');
        const dir = resolve(`${__dirname}/../commands/`);
        const modules = this.scanModule(dir, /.js|.ts/);
        const result = await Promise.all(modules.map(file => this.loadModule(file)));

        const commands = result.filter<Command>((value): value is Command => value instanceof Command)
            .map<ModuleData<string, Command>>(command => this.toModuleData(command));
        const subCommands = result.filter<SubCommand>((value): value is SubCommand => value instanceof SubCommand);

        await super.registerAll(commands);

        const needsSubcommands = this.filter(c => c.hasSubcom).map(({ name }) => name);
        for (const c of needsSubcommands) {
            const sub = subCommands.filter(s => s.parent.name === c);
            if (!sub.length) {
                logger.warn(`Command: ${c} has a subcommands but could not register because of cannot find child module`);
            } else {
                const subManager = new SubCommandManager(this.client);
                await subManager.registerSubCommands(sub, c);
                this.subCommands.set(c, subManager);
            }
        }
        logger.info(`Successfully registered ${this.size} commands`);
    }

    protected toModuleData(command: Command): ModuleData<string, Command> {
        return {
            key: command.name,
            value: command,
        };
    }
}
