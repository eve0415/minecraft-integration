const { MessageEmbed } = require('discord.js');
const localization = require('../../localization');

module.exports = async (instance, data) => {
  const server = instance.database.getFromPort(data.port);
  if (!server) throw new Error(`No valid server infomation found for port: ${data.port}`); // This shouldn't happen

  const serverName = server.name ?? server.type;

  const embed = new MessageEmbed()
    .setAuthor(data.name, data.UUID?.startsWith('00000000') ? null : `https://crafatar.com/avatars/${data.UUID}`)
    .addFields(
      [
        { name: 'Username', value: data.name, inline: true },
        { name: 'UUID', value: data.UUID ?? 'N/A', inline: true },
        { name: '\u200B', value: '\u200B', inline: true },
      ],
    )
    .setFooter(`ID: ${server.ID}`)
    .setTimestamp(new Date);

  if (data.mods) {
    embed.addFields(
      [
        { name: 'client', value: data.type ?? 'Unknown', inline: true },
        { name: 'version', value: data.version, inline: true },
        { name: 'mods', value: data.mods, inline: true },
      ],
    );
  } else if (data.version) {
    embed.addFields(
      [
        { name: 'client', value: data.type ?? 'Unknown', inline: true },
        { name: 'version', value: data.version, inline: true },
        { name: '\u200B', value: '\u200B', inline: true },
      ],
    );
  }

  switch (data.event) {
    case 'AUTH':
      embed
        .setColor('BLUE')
        .setTitle(`${data.name} is trying to connect to server ${serverName}`)
        .setDescription(`\`${data.name}(${data.ip})\` is trying to connect to server \`${serverName}\` ${data.address ? `by using \`${data.address}\` to connect` : ''}.`);
      break;

    case 'LOGIN':
      embed
        .setColor('BLUE')
        .setTitle(`${data.name} is logging in to server ${serverName}`)
        .setDescription(`\`${data.name}(${data.ip})\` is logging in to server \`${serverName}\` ${data.address ? `by using \`${data.address}\` to connect` : ''}.`);
      break;

    case 'DISCONNECT':
      embed
        .setColor('BLUE')
        .setTitle(`${data.name} has disconnected from server ${serverName}`)
        .setDescription(`\`${data.name}(${data.ip})\` has disconnected from server \`${serverName}\`.`);
      break;

    case 'KICK':
      embed
        .setColor('RED')
        .setTitle(`${data.name} was kicked from server ${serverName}`)
        .setDescription(`\`${data.name}(${data.ip})\` was kicked from server because of \`${data.reason}\``)
        .addField('Reason', data.reason);
      break;

    case 'KICKEDFROM':
      /* eslint-disable no-case-declarations */
      const r = data.reason.split(': ').pop();
      const reason = localization.reason[r] ?? r;
      let desc = `Failed to forward \`${data.name}(${data.ip})\` to server because of \`${reason}\``;
      /* eslint-enable no-case-declarations */
      if (data.fulfill === 'DisconnectPlayer') {
        desc += '\nDisconnecting from server.';
      } else if (data.fulfill === 'RedirectPlayer') {
        desc += '\nForwarding to another server.';
      }

      embed
        .setColor('RED')
        .setTitle(`Failed to forward ${data.name} to server ${data.fromServer}`)
        .setDescription(desc)
        .addField('Reason', reason, true)
        .addField('\u200B', '\u200B', true)
        .addField('Fulfill', data.fulfill, true);
      break;

    case 'PRECONNECT':
      embed
        .setColor('PURPLE')
        .setTitle(`Forwarding ${data.name} to server ${data.toServer}`)
        .setDescription(`Forwarding \`${data.name}(${data.ip}\`) to server \`${data.toServer}\` as requested.`);
      break;

    case 'POSTCONNECT':
      embed
        .setColor('PURPLE')
        .setTitle(`Succesfully connected ${data.name} to server ${data.currentServer} ${data.fromServer ? `from ${data.fromServer}` : ''}`)
        .setDescription(`Succesfully connected \`${data.name}(${data.ip})\` to server \`${data.currentServer}\`${data.fromServer ? ` from \`${data.fromServer}\`.` : ''}`);
      break;
  }

  instance.taskManager.sendLog(data.port, embed);
};
