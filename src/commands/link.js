const link = async (message, args) => {
	if (!client.socketManager.isConnected()) return message.channel.send("現在、サーバーが起動していないかオフラインのため、このコマンドを実行することができません");
	
	if (!args.length) {
		const code = client.linkManager.new(message.author.id, null);
		message.channel.send(`今から1分以内に、マイクラに \`/link ${code}\` を送信してください`);
	} else {
		client.linkManager.check(args[0], message.author.id, null)
			.then(result => message.channel.send(result))
			.catch(err => message.channel.send(err));
		
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
