const { statSync, mkdirSync } = require("fs");

try {
	statSync("./data");
} catch {
	mkdirSync("./data");
}

const db = require("better-sqlite3")("data/minecraft.sqlite3");

db.prepare("CREATE TABLE IF NOT EXISTS server (serverId numbers NOT NULL, serverType TEXT NOT NULL, serverName TEXT, lastServerStatus TEXT, updateTime TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')))").run();
db.prepare("CREATE TABLE IF NOT EXISTS channel (channelType TEXT NOT NULL, channelID TEXT NOT NULL, messageID TEXT, serverID TEXT)").run();

const channel = require("./channel");
const server = require("./server");

module.exports = {
	addChannelCache: channel.addChannelCache,
	getFromID: channel.getFromID,
	getFromType: channel.getFromType,
	removeChannelFromMessageID: channel.removeChannelFromMessageID,
	
	getFromPort: server.getFromID,
	updateServer: server.updateServer,
	removeServer: server.remove,
};
