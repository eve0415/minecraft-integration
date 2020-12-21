const { MessageEmbed } = require('discord.js');

module.exports = async (instance, status, data) => {
  await instance.database.updateServer(data.port, data.platform, instance);

  if (status !== 'connect') {
    instance.statusPage.updateStatus(data.port, status, data);
    instance.taskManager.refreshStatus();
  }

  if (status === 'online') return;

  const server = instance.database.getFromPort(data.port);
  const serverName = server.name ?? server.type;
  const embed = new MessageEmbed()
    .setFooter(`ID: ${data.port}`)
    .setTimestamp(new Date);

  switch (status) {
    case 'start':
      embed
        .setDescription(`Starting server \`${serverName}\` on port ${data.port}`)
        .setColor('YELLOW');
      break;

    case 'stop':
      embed
        .setDescription(`Stopping server \`${serverName}\` on port ${data.port}`)
        .setColor('YELLOW');
      break;

    case 'connect':
      embed
        .setDescription(`Connected to server \`${serverName}\` on port ${data.port}`)
        .setColor('GREEN');
      break;

    case 'offline':
      embed.setDescription(`Disconnected from server \`${serverName}\` on port ${data.port}`);
      break;
  }

  instance.taskManager.sendLog(data.port, embed);
};
