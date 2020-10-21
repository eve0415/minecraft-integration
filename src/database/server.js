const db = require("better-sqlite3")("data/minecraft.sqlite3");

const addServer = (port, type, status) => {
	const addCache = db.prepare("INSERT INTO server VALUES (@serverId, @serverType, @serverName, @lastServerStatus, @updateTime)");
	addCache.run({
		serverId: port,
		serverType: type,
		serverName: null,
		lastServerStatus: status,
		updateTime: new Date().toLocaleString(),
	});
};

exports.getFromID = port => {
	return db.prepare("SELECT * FROM server WHERE serverId = ?").get(port);
};

exports.updateServer = (port, type, status) => {
	const inDatabase = this.getFromID(port);
	inDatabase
		? db.prepare("UPDATE server SET serverType = ?, lastServerStatus = ?, updateTime = ? WHERE serverId = ?").run(type, status, new Date().toLocaleString(), port)
		: addServer(port, type, status);
};

exports.remove = (port) => {
	db.prepare("DELETE FROM channel WHERE serverId = ?").run(port);
};
