const { EventEmitter } = require("events");
const io = require("socket.io")();

module.exports = class socketManager extends EventEmitter {
	constructor() {
		super();
		this.ready = false;
		this.connected = false;
		this.chat = false;
		this.webhook = null;
		
		this._init();
	}
	
	async fetchWebhook() {
		const info = client.database.getFromUSE("chat");
		if (!info) return;
		
		const channel = client.channels.cache.get(info.channelID);
		
		channel.fetchWebhooks()
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
		
		this.ws.on("STARTING", () => this.emit("event", "STARTING"));
		this.ws.on("STARTED", () => this.emit("event", "STARTED"));
		this.ws.on("STOPPING", () => this.emit("event", "STOPPING"));
		this.ws.on("STATUS", (data) => this.emit("event", "STATUS", data));
		
		this.ws.on("MESSAGE", (data) => this.sendToDiscord(data));
		this.ws.on("ACHIEVEMENT", (data) => this.sendToDiscord(data));
		this.ws.on("JOIN", (data) => this.sendToDiscord(data));
		this.ws.on("QUIT", (data) => this.sendToDiscord(data));
		this.ws.on("DEATH", (data) => this.sendToDiscord(data));
		
		// this.ws.on("COMMAND", (data) => console.log(data.result));
		
		this.ws.on("LINK", (data) => this.emit("link", data));
	}
	
	async status(data) {
		const info = client.database.getFromUSE("status");
		if (!info) return;
		
		try {
			const message = await client.channels.cache.get(info.channelID)?.messages.fetch(info.messageID);
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
		
		const user = client.database.getFromDiscord(message.author.id);
		const uuid = user?.minecraftID ?? null;
		
		if (message.content) {
			const data = JSON.stringify({ UUID: uuid, name: message.author.username, message: message.content, url: null });
			this.ws.emit("message", data);
		}
		
		if (message.attachments.size) {
			message.attachments.forEach(attach => {
				const data = JSON.stringify({ UUID: uuid, name: message.author.username, message: "添付ファイル - クリックしてください", url: attach.url });
				this.ws.emit("message", data);
			});
		}
	}
	
	sendToDiscord(data) {
		if (!this.webhook) return;
		
		const user = client.database.getFromMinecraft(data.UUID);
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
		const user = client.database.getFromDiscord(message.author.id);
		
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
		client.log("Loading Manager: Socket Manager");
		
		io.on("connection", sock => {
			client.log("Succesfully connected to Minecraft Server");
			
			this.ws = sock;
			this.connected = true;
			
			this.listen();
		});
		
		io.listen(client.config.port);
		
		this.ready = true;
		client.log("Socket Manager is ready!");
	}
};
