const { Client, Collection } = require("discord.js");
const { readdir } = require("fs");
const readdirPromise = require("util").promisify(readdir);

const socketManager = require("./websocketManager");
const commandParser = require("./modules/commandParser");

module.exports = class MinecraftIntegrations {
	constructor() {
		this.config			= require("./config");
		this.logger			= require("./logger");
		this.database		= require("./database");
		this.statusPage		= require("./modules/statusPage");
		
		this._init();
	}
    
	get client() {
		return this.bot;
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
		this.logger.info("Subscribing Commands...");
		const files = await readdirPromise("./src/commands/");
		files.forEach(cmd => {
			const commandName = cmd.split(".")[0];
			const props = require(`./commands/${cmd}`);
			this.logger.info(`Loading Command: ${commandName}`);
			this.commands.set(props.name, props);
			const c = this.parser.addCommand(props.name, props.cmdOptions);
			props.options.forEach(option => c.options(option.name, option.type, option.opt));
		});
	}
	
	async cacheStatusPage() {
		const cache = this.database.getAllServer();
		cache.forEach((server) => {
			this.statusPage.addStatus(server.ID);
			if (server.name) this.statusPage.setName(server.ID, server.name);
		});
	}
	
	_login() {
		this.bot.login();
	}
    
	_init() {
		this.logger.info("-------------------------------");
		this.logger.info("Starting...");
		require("./helpers/process")(this);
		
		this.bot			= new Client();
		this.commands		= new Collection();
		this.socketManager	= new socketManager(this);
		this.parser			= new commandParser({ usePrefix: true, defaultPrefix: "!" });
		
		this.loadEvents();
		this.loadCommands();
		this.cacheStatusPage();
		
		this._login();
	}
};

