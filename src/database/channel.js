const db = require("better-sqlite3")("data/minecraft.sqlite3");

const add = (use, chID, mesID) => {
	const addCh = db.prepare("INSERT INTO channel VALUES (@channelUse, @channelID, @messageID)");
	addCh.run({
		channelUse: use,
		channelID: chID,
		messageID: mesID,
	});
};

exports.getFromID = id => {
	return db.prepare("SELECT * FROM channel WHERE channelID = ?").all(id);
};

exports.getFromUSE = name => {
	return db.prepare("SELECT * FROM channel WHERE channelUse = ?").all(name);
};

exports.update = (use, chID, mesID) => {
	const inDatabase = this.getFromUSE(use) ?? this.getFromID(chID);
	
	inDatabase ? db.prepare("UPDATE channel SET channelID = ?, messageID = ? WHERE channelUse = ?").run(chID, mesID, use) : add(use, chID, mesID);
};

exports.remove = (mesID) => {
	db.prepare("DELETE FROM channel WHERE messageID = ?").run(mesID);
};
