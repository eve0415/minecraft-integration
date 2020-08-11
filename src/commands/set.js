const set = async (message, args) => {
	const role = message.guild.members.cache.get(client.user.id).roles.cache.filter(r => r.managed);
	
	if (args[0] === "status") {
		const mes = await message.channel.send("設定しています...");
			
		await message.channel.overwritePermissions([
			{ 
				id: role.first(),
				allow: "SEND_MESSAGES",
			},
			{ 
				id: message.guild.roles.everyone,
				deny: "SEND_MESSAGES", 
			},
		]);
		
		mes.edit("", client.embeds.new).then(() => message.delete());
		
		client.database.channelUpdate("status", mes.channel.id, mes.id);
		
		if (!client.socketManager.isConnected()) {
			mes.edit(client.embeds.offline);
		}
	} else if (args[0] === "chat") {
		client.database.channelUpdate("chat", message.channel.id);
		
		message.channel
			.createWebhook("Minecraft", { avatar: "https://www.minecraft.net/etc.clientlibs/minecraft/clientlibs/main/resources/img/iso-grassblock.png" })
			.then(async () => {
				await message.channel.overwritePermissions([
					{ 
						id: role.first(),
						allow: "SEND_MESSAGES",
					},
					{ 
						id: message.guild.roles.everyone,
						deny: "SEND_MESSAGES", 
					},
				]);
				
				client.socketManager.fetchWebhook();
				
				message.channel.send("設定しました").then((m) => m.delete({ timeout: 10000 }).then(() => message.delete()));
				
				if (!client.socketManager.isConnected) client.disableChat();
			})
			.catch(() => message.channel.send("設定に失敗しました").then((m) => m.delete({ timeout: 10000 }).then(() => message.delete())));
	} else {
		message.channel.send("不明な引数です").then((m) => m.delete({ timeout: 10000 }).then(() => message.delete()));
	}
};

module.exports = {
	name: "set",
	aliases: ["s"],
	description: "チャンネル設定",
	usage: "set <status | chat>",
	owner: true,
	args: {
		need: true,
		max: 1,
	},
	run: set,
};
