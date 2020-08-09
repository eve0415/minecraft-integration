const { MessageEmbed } = require("discord.js");

module.exports = (client, event) => {
	let embed;
	
	switch (event) {
		case "STARTING":
			embed = new MessageEmbed()
				.setTitle("ステータス")
				.setColor("YELLOW")
				.setDescription("起動中です")
				.addField("状態", "起動中")
				.addField("プレーヤー", 0, true)
				.addField("最大人数", 0, true)
				.setTimestamp(new Date);
			return client.socketManager.status(embed);
			
		case "STARTED":
			return client.enableChat();
			
		case "STOPPING":
			client.disableChat();
			
			embed = new MessageEmbed()
				.setTitle("ステータス")
				.setColor("RED")
				.setDescription("シャットダウンしています")
				.addField("状態", "停止中")
				.addField("プレーヤー", 0, true)
				.addField("最大人数", 0, true)
				.setTimestamp(new Date);
			client.socketManager.status(embed);
			
			setTimeout(() => {
				embed = new MessageEmbed()
					.setTitle("ステータス")
					.setColor("BLACK")
					.setDescription("オフライン")
					.setTimestamp(new Date);
				client.socketManager.status(embed);
			}, 5000);
			return; 
	}
};
