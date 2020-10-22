const { MessageEmbed } = require('discord.js');

module.exports = {
  unknown: (id) => new MessageEmbed()
    .setColor('BLACK')
    .setTitle('Unknown Server')
    .setDescription('Unknown Server\nPlease contact bot/mod administrators')
    .setFooter(`ID: ${id}`)
    .setTimestamp(new Date),
    
  fetching: (id) => new MessageEmbed()
    .setColor('BLACK')
    .setTitle('Fetching Status')
    .setDescription('Fetching Status\nIt might take some time to refresh')
    .setFooter(`ID: ${id}`)
    .setTimestamp(new Date),
    
  no: (id) => new MessageEmbed()
    .setColor('GLAY')
    .setTitle('Unknown Status')
    .setDescription('Unknown Status\nIs the server online?')
    .setFooter(`ID: ${id}`)
    .setTimestamp(new Date),
    
  online: (data) => new MessageEmbed()
    .setTitle('STATUS')
    .setColor('BLUE')
    .addField('status', 'Online', true)
    .addField('\u200B', '\u200B', true)
    .addField('TPS', data.tps, true)
    .addField('\u200B', '\u200B')
    .addField('プレーヤー', data.onlineplayer, true)
    .addField('最大人数', data.maxPlayer, true)
    .addField('\u200B', '\u200B', true)
    .addField('\u200B', '\u200B')
    .addField('Total Memory', data.totalMemory, true)
    .addField('Used Memory', data.usedMemory, true)
    .addField('Free Memory', data.freeMemory, true)
    .setFooter(`ID: ${data.port}`)
    .setTimestamp(new Date),
        
  start: (data) => new MessageEmbed()
    .setTitle('STATUS')
    .setColor('YELLOW')
    .addField('status', 'Preparing...', true)
    .addField('\u200B', '\u200B', true)
    .addField('TPS', 'N/A', true)
    .addField('\u200B', '\u200B')
    .addField('プレーヤー', 'N/A', true)
    .addField('最大人数', 'N/A', true)
    .addField('\u200B', '\u200B', true)
    .addField('\u200B', '\u200B')
    .addField('Total Memory', data.totalMemory, true)
    .addField('Used Memory', data.usedMemory, true)
    .addField('Free Memory', data.freeMemory, true)
    .setFooter(`ID: ${data.port}`)
    .setTimestamp(new Date),
        
  stop: (data) => new MessageEmbed()
    .setTitle('STATUS')
    .setColor('RED')
    .addField('status', 'Shutting down...', true)
    .addField('\u200B', '\u200B', true)
    .addField('TPS', 'N/A', true)
    .addField('\u200B', '\u200B')
    .addField('プレーヤー', 'N/A', true)
    .addField('最大人数', 'N/A', true)
    .addField('\u200B', '\u200B', true)
    .addField('\u200B', '\u200B')
    .addField('Total Memory', data.totalMemory, true)
    .addField('Used Memory', data.usedMemory, true)
    .addField('Free Memory', data.freeMemory, true)
    .setFooter(`ID: ${data.port}`)
    .setTimestamp(new Date),
        
  offline: (id) => new MessageEmbed()
    .setTitle('STATUS')
    .setColor('BLACK')
    .setDescription('Offline')
    .setFooter(`ID: ${id}`)
    .setTimestamp(new Date),
};
