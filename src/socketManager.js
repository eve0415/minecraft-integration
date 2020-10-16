const { EventEmitter } = require("events");
const io = require("socket.io")();

module.exports = class socketManager extends EventEmitter {
	constructor(instance) {
		super();
		this.instance = instance;
		this.client = instance.client;
		this.database = instance.database;
		this.logger = instance.logger;
		
		this.connected = 0;
		this.chat = false;
		this.webhook = null;
		
		this._init();
	}
	
	async fetchWebhook() {
		const info = this.database.getFromUSE("chat");
		if (!info) return;
		
		const channel = this.client.channels.cache.get(info.channelID);
		
		channel?.fetchWebhooks()
			.then(webhooks => {
				this.webhook = webhooks.filter(webhook => webhook.owner === client.user).first();
			})
			.catch(() => {
				return;
			});
	}
	
	async listen() {
		this.ws.on("disconnect", (reason) => this.emit("disconnect", reason));
		this.ws.on("error", (err) => this.emit("error", err));
		
		this.ws.on("STARTING", (data) => this.emit("event", "STARTING", data));
		this.ws.on("STOPPING", (data) => this.emit("event", "STOPPING", data));
		this.ws.on("STATUS", (data) => this.emit("event", "STATUS", data));
		
		this.ws.on("CHAT", (data) => this.emit("event", "STATUS", data));
		this.ws.on("ACHIEVEMENT", (data) => this.emit("event", "STATUS", data));
	}
	
	async status(data) {
		const info = this.database.getFromUSE("status");
		if (!info) return;
		
		try {
			const message = await this.client.channels.cache.get(info.channelID)?.messages.fetch(info.messageID);
			if (message) message.edit(data);
		} catch (e) { // Message might have deleted by someone
			client.database.channelRemove(info.messageID);
		}
		
	}
	
	linkPlayer(data) {
		if (!this.connected) return;
		
		this.ws.emit("link", data);
	}
	
	sendFromDiscord(message) {
		if (!this.connected) return;
		
		const user = this.database.getFromDiscord(message.author.id);
		
		this.ws.emit("message", JSON.stringify({ 
			UUID: user?.minecraftID ?? null,
			name: message.author.username,
			message: message.content
				? message.attachments.size
					? `${message.content} (添付ファイルがあります。このメッセージをクリックしてください)`
					: message.content
				: "添付ファイルがあります。このメッセージをクリックしてください",
			url: message.attachments.size ? message.url : null,
		}));
	}
	
	sendToDiscord(data) {
		console.log(data);
		if (!this.webhook) return;
		
		const user = this.database.getFromMinecraft(data.UUID);
		if (user) {
			this.webhook.send(data.message, {
				username: client.users.cache.get(user.userId).username,
				avatarURL: client.users.cache.get(user.userId).avatarURL({ format: "png", dynamic: true }),
			});
		} else {
			this.webhook.send(data.message, {
				username: data.name,
			});
		}
	}
	
	commandController(message) {
		const user = this.database.getFromDiscord(message.author.id);
		
		if (!user) return message.channel.send("先に、 Minecraft アカウントとリンクしてください");
		if (!this.connected) return message.channel.send("サーバーが起動していないか、接続されていません。\n時間をおいてから再試行してください");
		
		const data = JSON.stringify({ UUID: user.minecraftID, name: message.author.username, message: message.content.slice(1) });
		this.ws.emit("command", data);
	}
	
	isConnected(status) {
		if (status !== undefined) this.connected = status;
		
		return this.connected;
	}
	
	isChatEnabled(status) {
		if (status !== undefined) this.chat = status;
		
		return this.chat;
	}
	
	async _init() {
		this.logger.info("Loading Manager: Socket Manager");
		
		io.on("connection", sock => {
			this.logger.info("Succesfully connected to Minecraft Server");
			
			this.ws = sock;
			this.connected = this.connected++;
			
			this.listen();
		});
		
		io.listen(this.instance.config.port);
		
		this.logger.info("Socket Manager is ready!");
	}
};
