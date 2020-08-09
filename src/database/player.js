const db = require("better-sqlite3")("data/minecraft.sqlite3");

exports.add = (discordID, minecraftUUID) => {
	const addPlayer = db.prepare("INSERT INTO player VALUES (@userId, @minecraftID)");
	addPlayer.run({
		userId: discordID,
		minecraftID: minecraftUUID,
	});
};

exports.getFromDiscord = id => {
	return db.prepare("SELECT * FROM player WHERE userId = ?").get(id);
};

exports.getFromMinecraft = id => {
	return db.prepare("SELECT * FROM player WHERE minecraftID = ?").get(id);
};
