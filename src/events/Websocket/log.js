const { MessageEmbed } = require('discord.js');

module.exports = async (instance, data) => {
  const server = instance.database.getFromPort(data.port);
  if (!server) throw new Error(`No valid server infomation found for port: ${data.port}`); // This shouldn't happen
  
  const serverName = server.name ? server.name : server.type;
  
  const embed = new MessageEmbed()
    .addField('Username', data.name)
    .addField('UUID', data.UUID ? data.UUID : 'N/A')
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
        .setDescription(`\`${data.name}(${data.ip})\` was kicked from server because of \`${data.reason}\`.`)
        .addField('Reason', data.reason);
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
