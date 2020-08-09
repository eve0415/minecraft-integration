const { statSync, mkdirSync } = require("fs");

try {
	statSync("./data");
} catch {
	mkdirSync("./data");
}

const db = require("better-sqlite3")("data/minecraft.sqlite3");

db.prepare("CREATE TABLE IF NOT EXISTS channel (channelUse TEXT NOT NULL, channelID TEXT NOT NULL, messageID TEXT)").run();
db.prepare("CREATE TABLE IF NOT EXISTS player (userId TEXT NOT NULL, minecraftID TEXT NOT NULL)").run();

const channel = require("./channel");
const player = require("./player");

module.exports = {
	getFromID: channel.getFromID,
	getFromUSE: channel.getFromUSE,
	channelUpdate: channel.update,
	
	userAdd: player.add,
	getFromDiscord: player.getFromDiscord,
	getFromMinecraft: player.getFromMinecraft,	
};
