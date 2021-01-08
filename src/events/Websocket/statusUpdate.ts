import { MessageEmbed } from 'discord.js';
import { websocketClient } from '../..';
import { MinecraftStatusManager } from '../../Managers';
import { database } from '../../database';
import { StatusData, StatusEmbedType, StatusType, WebsocketEvent } from '../../typings';

export default class extends WebsocketEvent {
    private readonly MinecraftStatusManager: MinecraftStatusManager;

    public constructor(client: websocketClient) {
        super(client, 'statusUpdate');
        this.MinecraftStatusManager = this.client.instance.MinecraftStatusManager;
    }

    public run(status: StatusType, data: StatusData): void {
        database.server.updateServer(data.port, data.platform);

        if (status !== 'CONNECT') {
            this.MinecraftStatusManager.updateStatus(data.port, status as StatusEmbedType, data);
            this.MinecraftStatusManager.refreshStatus();
        }

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