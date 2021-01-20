import { DJSClient, websocketClient } from '..';

export class DBase {
    public readonly client: DJSClient;
    public readonly name: string;

    public constructor(client: DJSClient, name: string) {
        this.client = client;
        this.name = name;
    }
}

export class WBase {
    public readonly client: websocketClient;
    public readonly name: string;

    public constructor(client: websocketClient, name: string) {
        this.client = client;
        this.name = name;
    }
}
