const { MessageEmbed } = require("discord.js");

module.exports = {
	unknown: (id) => new MessageEmbed()
		.setColor("BLACK")
		.setTitle("Unknown Server")
		.setDescription("Unknown Server\nPlease contact bot/mod administrators")
		.setFooter(`ID: ${id}`)
		.setTimestamp(new Date),
		
	fetching: (id) => new MessageEmbed()
		.setColor("BLACK")
		.setTitle("Fetching Status")
		.setDescription("Fetching Status\nIt might take some time to refresh")
		.setFooter(`ID: ${id}`)
		.setTimestamp(new Date),
		
	no: (id) => new MessageEmbed()
		.setColor("GLAY")
		.setTitle("Unknown Status")
		.setDescription("Unknown Status\nIs the server online?")
		.setFooter(`ID: ${id}`)
		.setTimestamp(new Date),
		
	online: (data) => new MessageEmbed()
		.setTitle("ステータス")
		.setColor("BLUE")
		.addField("状態", "オンライン", true)
		.addField("\u200B", "\u200B", true)
		.addField("TPS", data.tps, true)
		.addField("\u200B", "\u200B")
		.addField("プレーヤー", data.onlineplayer, true)
		.addField("最大人数", data.maxPlayer, true)
		.addField("\u200B", "\u200B", true)
		.addField("\u200B", "\u200B")
		.addField("合計メモリ", data.totalMemory, true)
		.addField("使用済みメモリ", data.usedMemory, true)
		.addField("空きメモリ", data.freeMemory, true)
		.setFooter(`ID: ${data.id}`)
		.setTimestamp(new Date),
        
	start: (data) => new MessageEmbed()
		.setTitle("ステータス")
		.setColor("YELLOW")
		.addField("状態", "起動中", true)
		.addField("\u200B", "\u200B", true)
		.addField("TPS", "N/A", true)
		.addField("\u200B", "\u200B")
		.addField("プレーヤー", "N/A", true)
		.addField("最大人数", "N/A", true)
		.addField("\u200B", "\u200B", true)
		.addField("\u200B", "\u200B")
		.addField("合計メモリ", data.totalMemory, true)
		.addField("使用済みメモリ", data.usedMemory, true)
		.addField("空きメモリ", data.freeMemory, true)
		.setFooter(`ID: ${data.id}`)
		.setTimestamp(new Date),
        
	stop: (data) => new MessageEmbed()
		.setTitle("ステータス")
		.setColor("RED")
		.addField("状態", "停止中", true)
		.addField("\u200B", "\u200B", true)
		.addField("TPS", "N/A", true)
		.addField("\u200B", "\u200B")
		.addField("プレーヤー", "N/A", true)
		.addField("最大人数", "N/A", true)
		.addField("\u200B", "\u200B", true)
		.addField("\u200B", "\u200B")
		.addField("合計メモリ", data.totalMemory, true)
		.addField("使用済みメモリ", data.usedMemory, true)
		.addField("空きメモリ", data.freeMemory, true)
		.setFooter(`ID: ${data.id}`)
		.setTimestamp(new Date),
        
	offline: (id) => new MessageEmbed()
		.setTitle("ステータス")
		.setColor("BLACK")
		.setDescription("オフライン")
		.setFooter(`ID: ${id}`)
		.setTimestamp(new Date),
};
