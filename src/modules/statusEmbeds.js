const { MessageEmbed } = require("discord.js");

module.exports = {
	unknown: new MessageEmbed()
		.setColor("BLACK")
		.setTitle("Unknown Status")
		.setDescription("Unknown Server\nPlease contact bot/mod administrators")
		.setTimestamp(new Date),
		
	status: (data) => new MessageEmbed()
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
		.setTimestamp(new Date),
        
	starting: new MessageEmbed()
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
		.addField("合計メモリ", "N/A", true)
		.addField("使用済みメモリ", "N/A", true)
		.addField("空きメモリ", "N/A", true)
		.setTimestamp(new Date),
        
	stopping: new MessageEmbed()
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
		.addField("合計メモリ", "N/A", true)
		.addField("使用済みメモリ", "N/A", true)
		.addField("空きメモリ", "N/A", true)
		.setTimestamp(new Date),
        
	offline: new MessageEmbed()
		.setTitle("ステータス")
		.setColor("BLACK")
		.setDescription("オフライン")
		.setTimestamp(new Date),
};
