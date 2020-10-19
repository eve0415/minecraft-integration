module.exports = async (instance, message) => {
	if (message.author === instance.client.user) return;
	if (message.author.bot) return;
	
	const info = instance.database.getFromUSE("chat");
	if (info && message.channel.id !== info.channelID && message.content.startsWith("/")) return instance.socketManager.commandController(message);
	
	if (info && message.channel.id === info.channelID && !message.content.startsWith(`${instance.config.prefix}link`)) return instance.socketManager.sendFromDiscord(message);
	
	// Does it start from prefix
	if (!message.content.startsWith(instance.config.prefix)) return;
	
	// Divide with command and arguments
	const [command, ...args] = message.content.toLowerCase().slice(instance.config.prefix.length).split(" ");
	
	// If there is a command
	const cmd = instance.commands.get(command) || instance.commands.get(instance.aliases.get(command));
	if (!cmd) return;
	
	// Identify
	if (cmd.author && message.author.id !== instance.config.owner) return message.channer.send("あなたはこのコマンドを実行する権限がありません").then((mes) => mes.delete({ timeout: 10000 }).then(() => message.delete()));
	
	if (!args.length && cmd.args.need) return message.channel.send("引数が指定されていません").then((mes) => mes.delete({ timeout: 10000 }).then(() => message.delete()));
	if (cmd.args.need && args.length < cmd.args.max) return message.channel.send("引数が少なすぎます").then((mes) => mes.delete({ timeout: 10000 }).then(() => message.delete()));
	if (args.length > cmd.args.max) return message.channel.send("引数が多すぎます").then((mes) => mes.delete({ timeout: 10000 }).then(() => message.delete()));
	
	// If there was as a command and also argument was appropriate
	instance.logger.info(`${message.author.username} (${message.author.id}) has execute ${cmd.name}`);
	cmd.run(message, args);
};
