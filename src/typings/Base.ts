import { DJSClient, websocketClient } from '..';

export default class Base {
    public readonly client: DJSClient | websocketClient;
    public readonly name: string;

    public constructor(client: DJSClient | websocketClient, name: string) {
        this.client = client;
        this.name = name;
    }
}
