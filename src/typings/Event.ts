import { DBase, WBase } from './Base';
import { DJSClient, websocketClient } from '..';

export abstract class DiscordEvent extends DBase {
    public readonly bind: (...args: unknown[]) => void;
    public constructor(client: DJSClient, name: string) {
        super(client, name);

        this.bind = this.run.bind(this);
    }

    public abstract run (...args: unknown[]): void;
}

export abstract class WebsocketEvent extends WBase {
    public readonly bind: (...args: unknown[]) => void;
    public constructor(client: websocketClient, name: string) {
        super(client, name);

        this.bind = this.run.bind(this);
    }

    public abstract run (...args: unknown[]): void;
}
