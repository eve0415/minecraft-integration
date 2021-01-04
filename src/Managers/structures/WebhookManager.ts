import { Webhook, WebhookMessageOptions } from 'discord.js';

export abstract class WebhookManager extends Array<WebhookBase> {
    public abstract init(): Promise<void>;

    public addCache(id: number, webhook: Webhook): void {
        this.push(new WebhookBase(id, webhook));
    }
}

class WebhookBase {
    public readonly id: number;
    public readonly webhook: Webhook;

    public constructor(id: number, webhook: Webhook) {
        this.id = Number(id);
        this.webhook = webhook;
    }

    public send(message: string, options?: WebhookMessageOptions) {
        this.webhook.send(message, options ?? {});
    }
}
