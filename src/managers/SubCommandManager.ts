import { ModuleData, ModuleManager } from './structures';
import { SubCommand } from '../typings';

export class SubCommandManager extends ModuleManager<string, SubCommand> {
    public async registerSubCommands(data: SubCommand[], parentName: string): Promise<void> {
        data.forEach(command => command.subscribeParent(parentName));
        await this.registerAll(data.map<ModuleData<string, SubCommand>>(command => this.toModuleData(command)));
    }

    protected toModuleData(subCommand: SubCommand): ModuleData<string, SubCommand> {
        return {
            key: subCommand.name,
            value: subCommand,
        };
    }
}
