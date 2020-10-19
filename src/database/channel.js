const db = require("better-sqlite3")("data/minecraft.sqlite3");

const add = (type, chID, mesID, serverID) => {
	const addCh = db.prepare("INSERT INTO channel VALUES (@channelType, @channelID, @messageID. @serverID)");
	addCh.run({
		channelType: type,
		channelID: chID,
		messageID: mesID,
		serverID: serverID,
	});
};

exports.getFromID = id => {
	return db.prepare("SELECT * FROM channel WHERE channelID = ?").get(id);
};

exports.getFromType = name => {
	return db.prepare("SELECT * FROM channel WHERE channelType = ?").get(name);
};

exports.updateChannelCache = (use, chID, mesID, serverID) => {
	const inDatabase = this.getFromUSE(use) ?? this.getFromID(chID);
	
	inDatabase ? db.prepare("UPDATE channel SET channelID = ?, messageID = ?, serverID = ? WHERE channelType = ?").run(chID, mesID, serverID, use) : add(use, chID, mesID, serverID);
};

exports.removeChannelFromMessageID = mesID => {
	db.prepare("DELETE FROM channel WHERE messageID = ?").run(mesID);
};

exports.removeChannelFromChannelIDandType = (channelID, type) => {
	db.prepare("DELETE FROM channel WHERE channelID = ? AND channelType = ?").run(channelID, type);
};

