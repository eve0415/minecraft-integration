require("./helpers/index");
require("./helpers/process");

const { readdir } = require("fs");
const readdirPromise = require("util").promisify(readdir);

const init = async () => {
	// Event Handler
	client.log("Subscribing Event...");
	
	// Discord Event
	const DiscordEvtFiles = await readdirPromise("./src/events/Discord/");
	DiscordEvtFiles.forEach(file => {
		if (!file.endsWith(".js")) return;
		const eventName = file.split(".")[0];
		const event = require(`./events/Discord/${file}`);
		client.log(`Loading Discord Event: ${eventName}`);
		client.on(eventName, event.bind(null, client));
	});
	
	// Websocket Event
	const WebsocketEvtFiles = await readdirPromise("./src/events/Websocket/");
	WebsocketEvtFiles.forEach(file => {
		if (!file.endsWith(".js")) return;
		const eventName = file.split(".")[0];
		const event = require(`./events/Websocket/${file}`);
		client.log(`Loading Websocket Event: ${eventName}`);
		client.socketManager.on(eventName, event.bind(null, client));
	});
	
	// Command Handler
	client.log("Subscribing Commands...");
	const files = await readdirPromise("./src/commands/");
	files.forEach(cmd => {
		const commandName = cmd.split(".")[0];
		client.loadCommand(cmd, commandName);
	});
	
	// login
	client.login(client.config.token);
};

client.log("Initializing...");
init();
