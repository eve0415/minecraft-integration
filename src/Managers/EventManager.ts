import { resolve } from 'path';
import { ModuleData, ModuleManager } from './ModuleManager';
import { logger } from '..';
import { DiscordEvent, WebsocketEvent } from '../typings';

export class DJSEventManager extends ModuleManager<string, DiscordEvent> {
    public register(data: ModuleData<string, DiscordEvent>): DiscordEvent {
        const event = data.value;
        logger.info(`Registering event: ${event.name}`);
        event.client.on(event.name, event.bind);
        return super.register(data);
    }

    public unregister(key: string): DiscordEvent {
        const event = super.unregister(key);
        logger.info(`Unregistering event: ${event.name}`);
        event.client.removeListener(event.name, event.bind);
        return event;
    }

    public async registerAll(): Promise<void> {
        logger.info('Trying to register all Discord events');
        const dir = resolve('./src/events/Discord');
        const modules = this.scanFiles(dir, /.js|.ts/);
        const result = (await Promise.all(modules.map(file => this.loadModule(resolve(dir, file)))))
            .filter<DiscordEvent>((value): value is DiscordEvent => value instanceof DiscordEvent)
            .map<ModuleData<string, DiscordEvent>>(event => this.toModuleData(event));
        await super.registerAll(result);
        return logger.info(`Successfully registered ${result.length} Discord events`);
    }

    protected toModuleData(event: DiscordEvent): ModuleData<string, DiscordEvent> {
        return {
            key: event.name,
            value: event,
        };
    }
}

