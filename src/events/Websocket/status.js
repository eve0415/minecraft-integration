const { MessageEmbed } = require("discord.js");

module.exports = (client, data) => {
	const embed = new MessageEmbed()
		.setTitle("ステータス")
		.setColor("BLUE")
		.addField("状態", "オンライン")
		.addField("プレーヤー", data.onlineplayer, true)
		.addField("最大人数", data.maxPlayer, true)
		.setTimestamp(new Date);
	client.socketManager.status(embed);
	
	return client.enableChat();
};
