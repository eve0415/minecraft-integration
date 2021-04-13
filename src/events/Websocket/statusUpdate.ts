import { MessageEmbed } from 'discord.js';
import { websocketClient } from '../..';
import { Server } from '../../database';
import { MinecraftStatusManager } from '../../managers';
import { StatusData, StatusEmbedType, StatusType, WebsocketEvent } from '../../typings';

export default class extends WebsocketEvent {
    private readonly statusManager: MinecraftStatusManager;

    public constructor(client: websocketClient) {
        super(client, 'statusUpdate');
        this.statusManager = this.client.instance.statusManager;
    }

    public async run(status: StatusType, data: StatusData): Promise<void> {
        const inDatabase = await Server.findOne({ serverID: data.port });
        if (!(data.port === inDatabase?.serverID && data.platform === inDatabase?.type) && data.platform) {
            if (inDatabase) {
                inDatabase.serverID = data.port;
                inDatabase.type = data.platform;
                await inDatabase.save();
            }
            if (!inDatabase?.name) this.statusManager.setName(data.port, data.platform);
        } else if (!inDatabase) {
            await new Server({ serverID: data.port, type: data.platform ?? 'UNKNOWN' }).save();
            this.statusManager.addStatus(data.port, data.platform ?? 'UNKNOWN');
        }

        this.statusManager.updateStatus(data.port, status as StatusEmbedType, data);
        this.statusManager.refreshStatus(data.port);

        if (status === 'UPDATE') return;

        const server = await Server.findOne({ serverID: data.port });
        const serverName = server?.name ?? server?.type;
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
