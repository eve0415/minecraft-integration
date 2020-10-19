const { MessageEmbed } = require("discord.js");

module.exports = (instance, reason) => {
	instance.logger.info(`Disconnected from Minecraft Server: ${reason}`);
	instance.socketManager.isConnected(false);
	
	setTimeout(() => {
		const embed = new MessageEmbed()
			.setTitle("ステータス")
			.setColor("BLACK")
			.setDescription("オフライン")
			.setTimestamp(new Date);
			
		client.socketManager.status(embed);
	}, 10000);
};
