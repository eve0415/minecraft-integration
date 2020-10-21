const { EventEmitter } = require("events");
const io = require("socket.io")();

const webhookManager = require("./webhookManager");

module.exports = class socketManager extends EventEmitter {
	constructor(instance) {
		super();
		this.instance	= instance;
		this.client		= instance.client;
		this.database	= instance.database;
		this.logger		= instance.logger;
		
		this.connected 	= 0;
		this.webhook	= new Array;
		
		this._init();
	}
	
	async fetchWebhook() {
		const chatCache = this.database.getFromType("chat");
		if (!chatCache) return;
		
		chatCache.forEach(chat => {
			const channel = this.client.channels.cache.get(chat.channelID);
			if (channel) {
				channel.fetchWebhooks()
					.then(webhooks => {
						const hook = webhooks.filter(webhook => webhook.owner === client.user).first();
						new webhookManager(this, hook, {});
					})
					.catch(() => this.database.removeChannelFromMessageID(chat.channelID, "chat")); // Probably webhook was deleted. Remove from cache.
			} else { // Maybe channel was deleted or no permission?
				// Remove cache from database
				this.database.removeChannelFromMessageID(chat.channelID, "chat");
			}
		});
	}
	
	async listen() {
		this.ws.on("disconnect", (reason) => {
			this.connected = this.connected--;
			this.emit("disconnect", reason);
		});
		this.ws.on("error", (err) => this.emit("error", err));
		
		this.ws.on("STARTING", (data) => this.emit("event", "STARTING", data));
		this.ws.on("STOPPING", (data) => this.emit("event", "STOPPING", data));
		this.ws.on("STATUS", (data) => this.emit("event", "STATUS", data));
		
		this.ws.on("CHAT", (data) => this.emit("event", "STATUS", data));
		this.ws.on("ACHIEVEMENT", (data) => this.emit("event", "STATUS", data));
		
		this.ws.on("ROOM", (roomID) => this.ws.join(roomID));
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
	
	connectionEvent() {
		io.on("connection", sock => {
			this.logger.info("Succesfully connected to Minecraft Server");
			
			this.ws = sock;
			this.connected = this.connected++;
			
			this.listen();
		});
	}
	
	async _init() {
		this.logger.info("Loading Manager: Socket Manager");
		
		this.connectionEvent();
		
		io.listen(this.instance.config.port);
		
		this.logger.info("Socket Manager is ready!");
	}
};
