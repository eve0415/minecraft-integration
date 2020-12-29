import { resolve } from 'path';
import { ModuleData, ModuleManager } from './ModuleManager';
import { logger } from '..';
import { Command } from '../typings';

export class CommandManager extends ModuleManager<string, Command> {
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
        const dir = resolve('./src/commands/');
        const modules = this.scanFiles(dir, /.js|.ts/);
        const result = (await Promise.all(modules.map(file => this.loadModule(resolve(dir, file)))))
            .filter<Command>((value): value is Command => value instanceof Command)
            .map<ModuleData<string, Command>>(command => this.toModuleData(command));
        await super.registerAll(result);
        return logger.info(`Successfully registered ${result.length} commands`);
    }

    protected toModuleData(command: Command): ModuleData<string, Command> {
        return {
            key: command.name,
            value: command,
        };
    }
}
