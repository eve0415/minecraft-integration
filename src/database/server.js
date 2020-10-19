const db = require("better-sqlite3")("data/minecraft.sqlite3");

exports.addServer = (port, type, name, status) => {
	const addCache = db.prepare("INSERT INTO server VALUES (@serverId, @serverType, @serverName, @lastServerStatus)");
	addCache.run({
		serverId: port,
		serverType: type,
		serverName: name,
		lastServerStatus: status,
	});
};

exports.getFromID = port => {
	return db.prepare("SELECT * FROM channel WHERE serverId = ?").get(port);
};

exports.updateServer = (port, type, name, status) => {
	db.prepare("UPDATE channel SET serverType = ?, serverName = ?, lastServerStatus = ?, WHERE serverId = ?").run(type, name, status, port);
};

exports.remove = (port) => {
	db.prepare("DELETE FROM channel WHERE serverId = ?").run(port);
};
