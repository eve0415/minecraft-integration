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
		
		this.ws.on("STATUS", (data) => this.emit("status", data));
		
		this.ws.on("MESSAGE", (data) => this.sendToDiscord(data));
		this.ws.on("ACHIEVEMENT", (data) => this.sendToDiscord(data));
		this.ws.on("JOIN", (data) => this.sendToDiscord(data));
		this.ws.on("QUIT", (data) => this.sendToDiscord(data));
		this.ws.on("DEATH", (data) => this.sendToDiscord(data));
		
		this.ws.on("LINK", (data) => this.emit("link", data));
	}
	
	async status(data) {
		const info = client.database.getFromUSE("status");
		
		const message = await client.channels.cache.get(info.channelID)?.messages.fetch(info.messageID);
		
		if (message) message.edit(data);
	}
	
	linkPlayer(data) {
		if (!this.connected) return;
		
		this.ws.emit("link", data);
	}
	
	sendFromDiscord(message) {
		const user = client.database.getFromDiscord(message.author.id);
		
		this.sendToServer(JSON.stringify({ UUID: user?.minecraftID ?? null, name: message.author.tag, message: message.content }));
	}
	
	sendToServer(data) {
		if (!this.connected) return;
		this.ws.emit("message", data);
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
		
		io.listen(25500);
		
		this.ready = true;
		client.log("Socket Manager is ready!");
	}
};
