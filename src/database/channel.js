const db = require("better-sqlite3")("data/minecraft.sqlite3");

exports.addChannelCache = (type, chID, mesID, serverID) => {
	const addCh = db.prepare("INSERT INTO channel VALUES (@type, @ID, @messageID, @serverID)");
	addCh.run({
		type: type,
		ID: chID,
		messageID: mesID,
		serverID: serverID,
	});
};

exports.getFromID = id => {
	return db.prepare("SELECT * FROM channel WHERE ID = ?").get(id);
};

exports.getFromType = name => {
	return db.prepare("SELECT * FROM channel WHERE type = ?").get(name);
};

exports.removeChannelFromMessageID = mesID => {
	db.prepare("DELETE FROM channel WHERE messageID = ?").run(mesID);
};

exports.removeChannelFromChannelIDandType = (ID, type) => {
	db.prepare("DELETE FROM channel WHERE ID = ? AND type = ?").run(ID, type);
};

