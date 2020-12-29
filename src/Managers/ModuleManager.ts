import { PathLike, readdirSync } from 'fs';
import { Collection } from 'discord.js';
import { DJSClient, websocketClient, logger } from '..';

export type ModuleData<K, V> = Readonly<{
  key: K,
  value: V
}>;

export abstract class ModuleManager<K, V> extends Collection<K, V> {
    private readonly client: DJSClient | websocketClient;

    public constructor(client: DJSClient | websocketClient) {
        super();
        this.client = client;
    }

    public register(data: ModuleData<K, V>): V {
        if (this.has(data.key)) logger.error(`Failed to register ${data.key} `, `${data.key} is used`);
        this.set(data.key, data.value);

        return data.value;
    }

    public unregister(key: K): V {
        const value = this.get(key) as V;
        if (!value || this.has(key)) logger.error(`Failed to unregister ${key} `, `${key} does not exist.`);
        this.delete(key);
        return value;
    }

    public registerAll(data: ModuleData<K, V>[]): Promise<unknown> {
        return Promise.all(data.map(value => this.register(value)));
    }

    public unregisterAll(): Promise<V[]> {
        return Promise.all(this.keyArray().map(key => this.unregister(key)));
    }

    protected scanFiles(dir: PathLike, pattern: RegExp): string[] {
        const dirCont = readdirSync(dir);
        return dirCont.filter(file => pattern.exec(file));
    }

    protected async loadModule(absolutePath: string): Promise<unknown> {
        try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            return create((await import(absolutePath)).default, this.client);
        } catch (e) {
            return new Error(e);
        }
    }

    protected abstract toModuleData(value: unknown): ModuleData<string, unknown>;
}

class A {}
type Type<T> = new (...args: unknown[]) => T;
const create = (ctor: Type<A>, client: DJSClient | websocketClient): A => new ctor(client);
