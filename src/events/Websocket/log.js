const { MessageEmbed } = require('discord.js');

module.exports = async (instance, data) => {
  const server = instance.database.getFromPort(data.port);
  if (!server) throw new Error(`No valid server infomation found for port: ${data.port}`); // This shouldn't happen
  
  const serverName = server.name ? server.name : server.type;
  
  const embed = new MessageEmbed()
    .addField('Username', data.name)
    .addField('UUID', data.UUID ? data.UUID : 'N/A')
    .setAuthor(data.name, data.UUID.startsWith('00000000') ? null : `https://crafatar.com/avatars/${data.UUID}`)
    .setFooter(`ID: ${server.ID}`)
    .setTimestamp(new Date);
  
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
      // eslint-disable-next-line no-case-declarations
      let reason;
      switch (data.reason) {
        case 'multiplayer.disconnect.authservers_down':
          reason = 'Authentication servers are down. Please try again later, sorry!';
          break;
          
        case 'multiplayer.disconnect.banned':
          reason = 'You are banned from this server.';
          break;
          
        case 'multiplayer.disconnect.duplicate_login':
          reason = 'You logged in from another location';
          break;
          
        case 'multiplayer.disconnect.flying':
          reason = 'Flying is not enabled on this server';
          break;
          
        case 'multiplayer.disconnect.idling':
          reason = 'You have been idle for too long!';
          break;
          
        case 'multiplayer.disconnect.illegal_characters':
          reason = 'Illegal characters in chat';
          break;
          
        case 'multiplayer.disconnect.invalid_entity_attacked':
          reason = 'Attempting to attack an invalid entity';
          break;
          
        case 'multiplayer.disconnect.invalid_player_movement':
          reason = 'Invalid move player packet received';
          break;
          
        case 'multiplayer.disconnect.invalid_vehicle_movement':
          reason = 'Invalid move player packet received';
          break;
          
        case 'multiplayer.disconnect.ip_banned':
          reason = 'You have been IP banned.';
          break;
          
        case 'multiplayer.disconnect.kicked':
          reason = 'Kicked by an operator.';
          break;
          
        case 'multiplayer.disconnect.server_shutdown':
          reason = 'Server closed';
          break;
          
        case 'multiplayer.disconnect.slow_login':
          reason = 'Took too long to log in';
          break;
          
        case 'multiplayer.disconnect.unverified_username':
          reason = 'Failed to verify username!';
          break;
          
        default:
          reason = data.reason;
          break;
      }
      // eslint-disable-next-line no-case-declarations
      let desc = `Failed to forward \`${data.name}(${data.ip})\` to server because of \`${reason}\``;
      if (data.fulfill === 'DisconnectPlayer') {
        desc += '\nDisconnecting from server.';
      } else if (data.fulfill === 'RedirectPlayer') {
        desc += '\nForwarding to another server.';
      }
      
      embed
        .setColor('RED')
        .setTitle(`Failed to forward ${data.name} to server ${data.fromServer}`)
        .setDescription(desc)
        .addField('Reason', reason)
        .addField('Fulfill', data.fulfill);
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
