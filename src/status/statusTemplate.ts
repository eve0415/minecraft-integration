import { MessageEmbed } from 'discord.js';
import { StatusData, StatusEmbedType } from '../typings';


export const getStatusEmbed = (s: StatusEmbedType, data?: StatusData): MessageEmbed => {
    const embed = new MessageEmbed().setTimestamp(new Date).setFooter(`ID: ${data?.serverId}`);

    switch (s) {
        case 'UNKNOWN':
            embed.setColor('BLACK')
                .setTitle('Unknown Server')
                .setDescription('Unknown Server\nPlease contact bot/mod administrators');
            break;

        case 'UPDATE':
            embed.setTitle(data?.serverName)
                .setColor('BLUE')
                .addField('Status', 'Online', true)
                .addField('\u200B', '\u200B', true)
                .addField('TPS', data?.tps, true)
                .addField('\u200B', '\u200B')
                .addField('Online Players', data?.onlinePlayers, true)
                .addField('Max Players', data?.maxPlayers, true)
                .addField('\u200B', '\u200B', true)
                .addField('\u200B', '\u200B')
                .addField('Total Memory', data?.totalMemory, true)
                .addField('Used Memory', data?.usedMemory, true)
                .addField('Free Memory', data?.freeMemory, true)
                .addField('\u200B', '\u200B')
                .addField('Uptime', getReadableTime(data?.uptime));
            break;

        case 'START':
        case 'CONSTRUCTING':
        case 'PREINITIALIZING':
        case 'INITIALIZING':
        case 'POSTINITIALIZING':
        case 'LOADCOMPLETE':
        case 'ABOUTTOSTART':
            if (s === 'START') embed.addField('Status', 'Preparing...', true);
            if (s === 'CONSTRUCTING') embed.addField('Status', 'Constructing...', true);
            if (s === 'PREINITIALIZING') embed.addField('Status', 'Pre Initializing...', true);
            if (s === 'INITIALIZING') embed.addField('Status', 'Initializing...', true);
            if (s === 'POSTINITIALIZING') embed.addField('Status', 'Post Initializing...', true);
            if (s === 'LOADCOMPLETE') embed.addField('Status', 'Load Complete...', true);
            if (s === 'ABOUTTOSTART') embed.addField('Status', 'Building World...', true);
            embed.setTitle(data?.serverName)
                .setColor('YELLOW')
                .addField('\u200B', '\u200B', true)
                .addField('TPS', 'N/A', true)
                .addField('\u200B', '\u200B')
                .addField('Online Players', 'N/A', true)
                .addField('Max Players', 'N/A', true)
                .addField('\u200B', '\u200B', true)
                .addField('\u200B', '\u200B')
                .addField('Total Memory', data?.totalMemory, true)
                .addField('Used Memory', data?.usedMemory, true)
                .addField('Free Memory', data?.freeMemory, true)
                .addField('\u200B', '\u200B')
                .addField('Uptime', getReadableTime(data?.uptime));
            break;

        case 'STOP':
            embed.setTitle(data?.serverName)
                .setColor('RED')
                .addField('Status', 'Shutting down...', true)
                .addField('\u200B', '\u200B', true)
                .addField('TPS', 'N/A', true)
                .addField('\u200B', '\u200B')
                .addField('Online Players', 'N/A', true)
                .addField('Max Players', 'N/A', true)
                .addField('\u200B', '\u200B', true)
                .addField('\u200B', '\u200B')
                .addField('Total Memory', data?.totalMemory, true)
                .addField('Used Memory', data?.usedMemory, true)
                .addField('Free Memory', data?.freeMemory, true)
                .addField('\u200B', '\u200B')
                .addField('Uptime', getReadableTime(data?.uptime));
            break;

        case 'OFFLINE':
            embed.setTitle(data?.serverName)
                .setColor('BLACK')
                .setDescription('Offline');
            break;

        case 'CONNECT':
            embed.setTitle(data?.serverName)
                .setColor('GREEN')
                .setDescription('Connected. Waiting for status update');
            break;
    }

    return embed;
};

const getReadableTime = (data: string | undefined): string => {
    const [day, hour, minute, second] = data?.split(':') ?? [0, 0, 0, 0];
    return `${day}d ${hour}h ${minute}m ${second}s`;
};
