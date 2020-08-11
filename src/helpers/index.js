const { Client, Collection } = require("discord.js");
const logger = require("log4js").getLogger();

const socketManager = require("../modules/socketManager");
const linkManager = require("../modules/linkManager");

logger.level = "debug";
client = new Client();

client.log = logString => logger.info(logString);
client.debug = logString => logger.debug(logString);
client.warn = logString => logger.warn(logString);
client.error = logString => logger.error(logString);
client.fatal = logString => logger.fatal(logString);

client.config = require("../config");
client.database = require("../database");
client.embeds = require("../modules/embed");

client.commands = new Collection();
client.aliases = new Collection();
client.socketManager = new socketManager();
client.linkManager = new linkManager();

client.loadCommand = async (path, commandName) => {
	try {
		path = path.replace("src", "..");
		const props = require(`../commands/${path}`);
		
		client.log(`Loading Command: ${commandName}`);
		
		client.commands.set(props.name, props);
		props.aliases.forEach(alias => client.aliases.set(alias, props.name));
	} catch (e) {
		client.error(`Unable to load command: ${commandName} @${e}`);
	}
};

client.enableChat = async () => {
	if (client.socketManager.isChatEnabled()) return;
	
	client.socketManager.isChatEnabled(true);
	
	const chat = client.database.getFromUSE("chat");
	if (!chat) return;
	
	const channel = client.channels.cache.get(chat.channelID);
	if (!channel) return;
	
	channel.updateOverwrite(channel.guild.roles.everyone, { SEND_MESSAGES: true });
	
	const messages = await channel.messages.fetch({ limit: 1 });
	
	if (messages.first().author === client.user) messages.first().delete();
};

client.disableChat = () => {
	if (!client.socketManager.isChatEnabled()) return;
	
	client.socketManager.isChatEnabled(false);
	
	const chat = client.database.getFromUSE("chat");
	if (!chat) return;
	
	const channel = client.channels.cache.get(chat.channelID);
	if (!channel) return;
	
	channel.updateOverwrite(channel.guild.roles.everyone, { SEND_MESSAGES: false });
	channel.send(client.embeds.disable);
};
