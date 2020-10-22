const db = require("better-sqlite3")("data/minecraft.sqlite3");
// channelID TEXT NOT NULL, serverID TEXT
exports.addCache = (chID, serverID) => {
	const addCh = db.prepare("INSERT INTO channel VALUES (@channelID, @serverID)");
	addCh.run({
		channelID: chID,
		serverID: serverID,
	});
};

exports.getFromID = chID => {
	return db.prepare("SELECT * FROM channel WHERE channelID = ?").get(chID);
};

exports.removeCache = chID => {
	db.prepare("DELETE FROM channel WHERE channelID").run(chID);
};

