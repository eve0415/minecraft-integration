import { MessageEmbed } from 'discord.js';
import { websocketClient } from '../..';
import { database } from '../../database';
import { MinecraftStatusManager } from '../../managers';
import { StatusData, StatusEmbedType, StatusType, WebsocketEvent } from '../../typings';

export default class extends WebsocketEvent {
    private readonly statusManager: MinecraftStatusManager;

    public constructor(client: websocketClient) {
        super(client, 'statusUpdate');
        this.statusManager = this.client.instance.statusManager;
    }

    public run(status: StatusType, data: StatusData): void {
        const inDatabase = database.server.getFromID(data.port);
        if (!(data.port === inDatabase?.ID && data.platform === inDatabase?.type) && data.platform) {
            database.server.updateServer(data.port, data.platform);
            if (!inDatabase?.name) this.statusManager.setName(data.port, data.platform);
        } else if (!inDatabase) {
            database.server.addServer(data.port, data.platform ?? 'UNKNOWN');
            this.statusManager.addStatus(data.port, data.platform ?? 'UNKNOWN');
        }

        this.statusManager.updateStatus(data.port, status as StatusEmbedType, data);
        this.statusManager.refreshStatus(data.port);

        if (status === 'UPDATE') return;

        const server = database.server.getFromID(data.port);
        const serverName = server.name ?? server.type;
        const embed = new MessageEmbed()
            .setFooter(`ID: ${data.port}`)
            .setTimestamp(new Date);

        switch (status) {
            case 'START':
                embed
                    .setDescription(`Starting server \`${serverName}\` on port ${data.port}`)
                    .setColor('YELLOW');
                break;

            case 'STOP':
                embed
                    .setDescription(`Stopping server \`${serverName}\` on port ${data.port}`)
                    .setColor('YELLOW');
                break;

            case 'CONNECT':
                embed
                    .setDescription(`Connected to server \`${serverName}\` on port ${data.port}`)
                    .setColor('GREEN');
                break;

            case 'OFFLINE':
                embed.setDescription(`Disconnected from server \`${serverName}\` on port ${data.port}`);
                break;
        }

        this.client.instance.logManager.sendWebhook(data.port, embed);
    }
}
