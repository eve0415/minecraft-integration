const link = async (message, args) => {
	let mes;
	
	if (!client.socketManager.isConnected()) {
		mes = message.channel.send("現在、サーバーが起動していないかオフラインのため、このコマンドを実行することができません");
	} else if (!args.length) {
		const code = client.linkManager.new(message.author.id, null);
		mes = message.channel.send(`今から1分以内に、マイクラに \`/link ${code}\` を送信してください`);
	} else {
		client.linkManager.check(args[0], message.author.id, null)
			.then(result => mes = message.channel.send(result))
			.catch(err => mes = message.channel.send(err));
	}
	
	const info = client.database.getFromUSE("chat");
	if (info && message.channel.id === info.channelID) {
		message.delete({ timeout: 3000 });
		if (mes) mes.delete({ timeout: 3000 });
	}
};

module.exports = {
	name: "link",
	aliases: [],
	description: "Discord と マインクラフトのユーザーをリンクします",
	usage: "link [code]",
	args: {
		need: false,
		max: 1,
	},
	run: link,
};
