const { MessageEmbed } = require('discord.js');

module.exports = {
  unknown: (id) => new MessageEmbed()
    .setColor('BLACK')
    .setTitle('Unknown Server')
    .setDescription('Unknown Server\nPlease contact bot/mod administrators')
    .setFooter(`ID: ${id}`)
    .setTimestamp(new Date),

  fetching: new MessageEmbed()
    .setColor('BLACK')
    .setTitle('Fetching Status')
    .setDescription('Fetching Status\nIt might take some time to refresh')
    .setFooter('ID: 0 Page: 0/0')
    .setTimestamp(new Date),

  online: (name, data) => new MessageEmbed()
    .setTitle(name ?? data.platform)
    .setColor('BLUE')
    .addField('Status', 'Online', true)
    .addField('\u200B', '\u200B', true)
    .addField('TPS', data.tps, true)
    .addField('\u200B', '\u200B')
    .addField('Online Players', data.onlinePlayers, true)
    .addField('Max Players', data.maxPlayers, true)
    .addField('\u200B', '\u200B', true)
    .addField('\u200B', '\u200B')
    .addField('Total Memory', data.totalMemory, true)
    .addField('Used Memory', data.usedMemory, true)
    .addField('Free Memory', data.freeMemory, true)
    .addField('\u200B', '\u200B')
    .addField('Uptime', getReadableTime(data.uptime))
    .setTimestamp(new Date),

  start: (name, data) => new MessageEmbed()
    .setTitle(name ?? data.platform)
    .setColor('YELLOW')
    .addField('Status', 'Preparing...', true)
    .addField('\u200B', '\u200B', true)
    .addField('TPS', 'N/A', true)
    .addField('\u200B', '\u200B')
    .addField('Online Players', 'N/A', true)
    .addField('Max Players', 'N/A', true)
    .addField('\u200B', '\u200B', true)
    .addField('\u200B', '\u200B')
    .addField('Total Memory', data.totalMemory, true)
    .addField('Used Memory', data.usedMemory, true)
    .addField('Free Memory', data.freeMemory, true)
    .addField('\u200B', '\u200B')
    .addField('Uptime', getReadableTime(data.uptime))
    .setTimestamp(new Date),

  stop: (name, data) => new MessageEmbed()
    .setTitle(name ?? data.platform)
    .setColor('RED')
    .addField('Status', 'Shutting down...', true)
    .addField('\u200B', '\u200B', true)
    .addField('TPS', 'N/A', true)
    .addField('\u200B', '\u200B')
    .addField('Online Players', 'N/A', true)
    .addField('Max Players', 'N/A', true)
    .addField('\u200B', '\u200B', true)
    .addField('\u200B', '\u200B')
    .addField('Total Memory', data.totalMemory, true)
    .addField('Used Memory', data.usedMemory, true)
    .addField('Free Memory', data.freeMemory, true)
    .addField('\u200B', '\u200B')
    .addField('Uptime', getReadableTime(data.uptime))
    .setTimestamp(new Date),

  offline: (name) => new MessageEmbed()
    .setTitle(name)
    .setColor('BLACK')
    .setDescription('Offline')
    .setTimestamp(new Date),
};

const getReadableTime = data => {
  const [day, hour, minute, second] = data.split(':');
  return `${day}d ${hour}h ${minute}m ${second}s`;
};
