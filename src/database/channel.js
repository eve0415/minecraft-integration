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
	return db.prepare("SELECT * FROM channel WHERE channelID = ?").get(id);
};

exports.getFromUSE = name => {
	return db.prepare("SELECT * FROM channel WHERE channelUse = ?").get(name);
};

exports.update = (use, chID, mesID) => {
	const inDatabase = this.getFromUSE(use) ?? this.getFromID(chID);
	
	const data = inDatabase ? db.prepare("UPDATE channel SET channelID = ?, messageID = ? WHERE channelUse = ?").run(chID, mesID, use) : add(use, chID, mesID);
	client.log(data);
};
