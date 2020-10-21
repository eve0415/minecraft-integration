const { statSync, mkdirSync } = require("fs");

try {
	statSync("./data");
} catch {
	mkdirSync("./data");
}

const db = require("better-sqlite3")("data/minecraft.sqlite3");

db.prepare("CREATE TABLE IF NOT EXISTS server (ID numbers NOT NULL, type TEXT NOT NULL, name TEXT, lastStatus TEXT, updateTime TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')))").run();
db.prepare("CREATE TABLE IF NOT EXISTS channel (type TEXT NOT NULL, ID TEXT NOT NULL, messageID TEXT, serverID TEXT)").run();

const channel = require("./channel");
const server = require("./server");

module.exports = {
	addChannelCache: channel.addChannelCache,
	getFromID: channel.getFromID,
	getFromType: channel.getFromType,
	removeChannelFromMessageID: channel.removeChannelFromMessageID,
	
	getFromPort: server.getFromID,
	getAllServer: server.getAllServer,
	updateServer: server.updateServer,
	removeServer: server.remove,
};
