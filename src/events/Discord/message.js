module.exports = async (instance, message) => {
  if (message.author === instance.client.user) return;
  if (message.author.bot) return;
	
  const info = instance.database.getFromType('chat');
  if (message.channel.id !== info?.channelID && message.content.startsWith('/')) return instance.socketManager.commandController(message);
  if (message.channel.id === info?.channelID && !message.content.startsWith(`${instance.config.prefix}link`)) return instance.socketManager.sendFromDiscord(message);
	
  const result = instance.parser.parse(message.content);
	
  const cmd = instance.commands.get(result.command);
	
  if (!cmd) return;
	
  // Identify
  if (cmd.author && message.author.id !== instance.config.owner) return message.channer.send('あなたはこのコマンドを実行する権限がありません').then((mes) => mes.delete({ timeout: 10000 }).then(() => message.delete()));
	
  // If there was as a command and also argument was appropriate
  instance.logger.info(`${message.author.username} (${message.author.id}) has execute ${cmd.name}`);
  cmd.run(instance, message, result);
};
