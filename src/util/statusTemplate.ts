import { MessageEmbed } from 'discord.js';
import { StatusData, statusEmbedType } from '../typings';

interface statusEmbedData {
    id: number
    name: string
    data: StatusData
}

export const getStatusEmbed = (s: statusEmbedType, info: Partial<statusEmbedData>): MessageEmbed => {
    const data = info?.data;
    const embed = new MessageEmbed().setTimestamp(new Date);

    switch (s) {
        case 'UNKNOWN':
            embed.setColor('BLACK')
                .setTitle('Unknown Server')
                .setDescription('Unknown Server\nPlease contact bot/mod administrators')
                .setFooter(`ID: ${info.id}`);
            break;

        case 'ONLINE':
            embed.setTitle(info.name ?? data?.platform)
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
            embed.setTitle(info.name ?? data?.platform)
                .setColor('YELLOW')
                .addField('Status', 'Preparing...', true)
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
            embed.setTitle(info.name ?? data?.platform)
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
            embed.setTitle(info.name)
                .setColor('BLACK')
                .setDescription('Offline');
            break;
    }

    return embed;
};

const getReadableTime = (data: string | undefined): string => {
    const [day, hour, minute, second] = data?.split(':') ?? [0, 0, 0, 0];
    return `${day}d ${hour}h ${minute}m ${second}s`;
};
