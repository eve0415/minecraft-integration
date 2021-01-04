import { ModuleData, ModuleManager } from './structures';
import { SubCommand } from '../typings';

export class SubCommandManager extends ModuleManager<string, SubCommand> {
    public async registerSubCommands(data: SubCommand[]): Promise<void> {
        await this.registerAll(data.map<ModuleData<string, SubCommand>>(command => this.toModuleData(command)));
    }

    protected toModuleData(command: SubCommand): ModuleData<string, SubCommand> {
        return {
            key: command.name,
            value: command,
        };
    }
}
