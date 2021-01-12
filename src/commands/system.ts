import { Message, MessageEmbed } from 'discord.js';
import { currentLoad, osInfo, cpu, mem, time } from 'systeminformation';
import { DJSClient } from '..';
import { Command } from '../typings';

export default class extends Command {
    public constructor(client: DJSClient) {
        super(client, 'system', {
            description: 'Show system information',
            usage: 'system',
            alias: ['sys'],
        });
    }

    public async run(message: Message): Promise<void> {
        const mes = await message.channel.send('Calculating...');
        const [os, cpuInfo, load, memory, times] = [await osInfo(), await cpu(), await currentLoad(), await mem(), time()];

        await mes.edit('', new MessageEmbed()
            .setColor('BLUE')
            .setTitle('System Infomation')
            .addField('Platform', os.platform, true)
            .addField('Distribution', os.distro, true)
            .addField('\u200B', '\u200B')
            .addField('CPU manufacturer', cpuInfo.manufacturer, true)
            .addField('CPU brand', cpuInfo.brand, true)
            .addField('CPU Usage', Math.round(load.currentload), true)
            .addField('\u200B', '\u200B')
            .addField('Total Memory', bytesToSize(memory.total), true)
            .addField('Used Memory', bytesToSize(memory.used), true)
            .addField('Free Memory', bytesToSize(memory.free), true)
            .addField('\u200B', '\u200B')
            .addField('Uptime', getReadableTime(Number(times.uptime)))
            .setTimestamp(new Date));
    }
}

const bytesToSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return 'n/a';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    if (i === 0) return `${bytes} ${sizes[i]}`;
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
};

const getReadableTime = (s: number) => `${Math.floor(s / 60 / 60 / 24)}d ${Math.floor(s / 60 / 60) % 24}h ${Math.floor(s / 60) % 60}m ${s % 60}s`;
