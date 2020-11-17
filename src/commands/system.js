const si = require('systeminformation');
const { MessageEmbed } = require('discord.js');

const set = async (instance, message) => {
  const mes = await message.channel.send('Calculating...');
  const [os, cpu, load, mem, time] =  [await si.osInfo(), await si.cpu(), await si.currentLoad(), await si.mem(), si.time()];
  
  await mes.edit('', new MessageEmbed()
    .setColor('BLUE')
    .setTitle('System Infomation')
    .addField('Platform', os.platform, true)
    .addField('Distribution', os.distro, true)
    .addField('\u200B', '\u200B')
    .addField('CPU manufacturer', cpu.manufacturer, true)
    .addField('CPU brand', cpu.brand, true)
    .addField('CPU Usage', Math.round(load.currentload), true)
    .addField('\u200B', '\u200B')
    .addField('Total Memory', bytesToSize(mem.total), true)
    .addField('Used Memory', bytesToSize(mem.used), true)
    .addField('Free Memory', bytesToSize(mem.free), true)
    .addField('\u200B', '\u200B')
    .addField('Uptime', getReadableTime(time.uptime))
    .setTimestamp(new Date));
};

const bytesToSize = bytes => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return 'n/a';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  if (i === 0) return `${bytes} ${sizes[i]}`;
  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
};

const getReadableTime = s => {
  return `${Math.floor(s / 60 / 60 / 24)}d ${Math.floor(s / 60 / 60) % 24}h ${Math.floor(s / 60) % 60}m ${s % 60}s`;
};

module.exports = {
  name: 'system',
  cmdOptions: {
    alias: ['sys'],
    description: 'Show system infomation',
    usage: 'system',
  },
  options: [],
  owner: false,
  run: set,
};
