const { Client } = require("discord.js");
const { readdir } = require("fs");
const readdirPromise = require("util").promisify(readdir);

const socketManager = require("./socketManager");

module.exports = class MinecraftIntegrations {
	constructor() {
		this.bot = new Client();
		this.config = require("./config");
		this.logger = require("./logger");
		this.database = require("./database");
		this._init();
	}
    
	get client() {
		return this.bot;
	}
	
	getSocketManager() {
		return this.socketManager;
	}
    
	async loadEvents() {
		this.logger.info("Initializing events");
		
		// Discord Event
		const DiscordEvtFiles = await readdirPromise("./src/events/Discord/");
		DiscordEvtFiles.forEach(file => {
			if (!file.endsWith(".js")) return;
			const eventName = file.split(".")[0];
			const event = require(`./events/Discord/${file}`);
			this.logger.info(`Loading Discord Event: ${eventName}`);
			this.bot.on(eventName, event.bind(null, this));
		});
	
		// Websocket Event
		const WebsocketEvtFiles = await readdirPromise("./src/events/Websocket/");
		WebsocketEvtFiles.forEach(file => {
			if (!file.endsWith(".js")) return;
			const eventName = file.split(".")[0];
			const event = require(`./events/Websocket/${file}`);
			this.logger.info(`Loading Websocket Event: ${eventName}`);
			this.socketManager.on(eventName, event.bind(null, this));
		});
	}
	
	async loadCommands() {
		client.log("Subscribing Commands...");
		const files = await readdirPromise("./src/commands/");
		files.forEach(cmd => {
			const commandName = cmd.split(".")[0];
			console.log(cmd);
			const props = require(`../commands/${cmd}`);
			this.logger.info(`Loading Command: ${commandName}`);
			this.bot.commands.set(props.name, props);
			props.aliases.forEach(alias => this.bot.aliases.set(alias, props.name));
		});
	}
	
	_login() {
		this.bot.login(this.config.token);
	}
    
	_init() {
		this.logger.info("-------------------------------");
		this.logger.info("Starting...");
		require("./helpers/process")(this);
		this.socketManager = new socketManager(this);
		this.loadEvents();
		this.loadCommands();
		
		this._login();
	}
};

