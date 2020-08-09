const { MessageEmbed } = require("discord.js");

module.exports = (client, reason) => {
	client.log(`Disconnected from Minecraft Server: ${reason}`);
	client.socketManager.isConnected(false);
	
	client.disableChat();
	
	setTimeout(() => {
		const embed = new MessageEmbed()
			.setTitle("ステータス")
			.setColor("BLACK")
			.setDescription("オフライン")
			.setTimestamp(new Date);
			
		client.socketManager.status(embed);
	}, 10000);
};
