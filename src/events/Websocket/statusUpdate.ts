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
        const inDatabase = await Server.findOne({ serverID: data.serverId });
        if (!inDatabase) {
            const firstNameToSave = data.serverName ? data.serverName : 'UNKNOWN';
            const newDataToSave = new Server({ serverID: data.serverId, name: firstNameToSave });
            if (data.serverName) newDataToSave.name = data.serverName;
            await newDataToSave.save();
            this.statusManager.addStatus(data.serverId, firstNameToSave);
        } else if (inDatabase.name !== data.serverName) {
            inDatabase.name = data.serverName;
            this.statusManager.setName(data.serverId, data.serverName);
            await inDatabase.save();
        }

        this.statusManager.updateStatus(data.serverId, status as StatusEmbedType, data);
        this.statusManager.refreshStatus(data.serverId);

        if (status === 'UPDATE') return;

        const server = await Server.findOne({ serverID: data.serverId });
        if (!server) return;
        const embed = new MessageEmbed()
            .setFooter(`ID: ${data.serverId}`)
            .setTimestamp(new Date);

        switch (status) {
            case 'START':
            case 'CONSTRUCTING':
            case 'PREINITIALIZING':
            case 'INITIALIZING':
            case 'POSTINITIALIZING':
            case 'LOADCOMPLETE':
            case 'ABOUTTOSTART':
            case 'GAMESTART':
            case 'STOP':
                if (status === 'START') embed.setDescription(`Starting server \`${server.name}\` on ID ${data.serverId}`);
                if (status === 'CONSTRUCTING') embed.setDescription(`Constructing server \`${server.name}\` on ID ${data.serverId}`);
                if (status === 'PREINITIALIZING') embed.setDescription(`Pre initializing server \`${server.name}\` on ID ${data.serverId}`);
                if (status === 'INITIALIZING') embed.setDescription(`Initializng server \`${server.name}\` on ID ${data.serverId}`);
                if (status === 'POSTINITIALIZING') embed.setDescription(`Post initializing server \`${server.name}\` on ID ${data.serverId}`);
                if (status === 'LOADCOMPLETE') embed.setDescription(`Loading server complete \`${server.name}\` on ID ${data.serverId}`);
                if (status === 'ABOUTTOSTART') embed.setDescription(`Building world \`${server.name}\` on ID ${data.serverId}`);
                if (status === 'GAMESTART') embed.setDescription(`Game started \`${server.name}\` on ID ${data.serverId}`);
                if (status === 'STOP') embed.setDescription(`Stopping server \`${server.name}\` on ID ${data.serverId}`);
                embed.setColor('YELLOW');
                break;

            case 'CONNECT':
                embed
                    .setDescription(`Connected to server \`${server.name}\` on ID ${data.serverId}`)
                    .setColor('GREEN');
                break;

            case 'OFFLINE':
                embed.setDescription(`Disconnected from server \`${server.name}\` on ID ${data.serverId}`);
                break;
        }

        this.client.instance.logManager.sendWebhook(data.serverId, embed);
    }
}
