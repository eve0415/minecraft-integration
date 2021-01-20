import { resolve } from 'path';
import { ModuleData, ModuleManager } from './structures';
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
        const dir = resolve(`${__dirname}/../events/Discord`);
        const modules = this.scanModule(dir, /.js|.ts/);
        const result = (await Promise.all(modules.map(file => this.loadModule(file))))
            .filter<DiscordEvent>((value): value is DiscordEvent => value instanceof DiscordEvent)
            .map<ModuleData<string, DiscordEvent>>(event => this.toModuleData(event));
        await super.registerAll(result);
        logger.info(`Successfully registered ${this.size} Discord events`);
    }

    public async unregisterAll(): Promise<void> {
        logger.info('Trying to unregister all Discord events');
        await super.unregisterAll();
    }

    protected toModuleData(event: DiscordEvent): ModuleData<string, DiscordEvent> {
        return {
            key: event.name,
            value: event,
        };
    }
}

export class wsEventManager extends ModuleManager<string, WebsocketEvent> {
    public register(data: ModuleData<string, WebsocketEvent>): WebsocketEvent {
        const event = data.value;
        logger.info(`Registering event: ${event.name}`);
        event.client.on(event.name, event.bind);
        return super.register(data);
    }

    public unregister(key: string): WebsocketEvent {
        const event = super.unregister(key);
        logger.info(`Unregistering event: ${event.name}`);
        event.client.removeListener(event.name, event.bind);
        return event;
    }

    public async registerAll(): Promise<void> {
        logger.info('Trying to register all Websocket events');
        const dir = resolve(`${__dirname}/../events/Websocket`);
        const modules = this.scanModule(dir, /.js|.ts/);
        const result = (await Promise.all(modules.map(file => this.loadModule(file))))
            .filter<WebsocketEvent>((value): value is WebsocketEvent => value instanceof WebsocketEvent)
            .map<ModuleData<string, WebsocketEvent>>(event => this.toModuleData(event));
        await super.registerAll(result);
        return logger.info(`Successfully registered ${this.size} Websocket events`);
    }

    protected toModuleData(event: WebsocketEvent): ModuleData<string, WebsocketEvent> {
        return {
            key: event.name,
            value: event,
        };
    }
}
