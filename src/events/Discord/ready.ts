import { DJSClient, logger } from '../..';
import { DiscordEvent } from '../../typings';

export default class extends DiscordEvent {
    public constructor(client: DJSClient) {
        super(client, 'ready');
    }

    public run(): void {
        logger.info('Bot has succesfully logged in and is Ready.');
    }
}
