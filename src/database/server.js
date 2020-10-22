const db = require("better-sqlite3")("data/minecraft.sqlite3");

const addServer = (port, type, status, instance) => {
	const addCache = db.prepare("INSERT INTO server VALUES (@ID, @type, @name, @lastStatus, @updateTime)");
	addCache.run({
		ID: port,
		type: type,
		name: null,
		lastStatus: status,
		updateTime: new Date().toLocaleString(),
	});
	instance.statusPage.addStatus(port);
};

exports.getFromID = port => {
	return db.prepare("SELECT * FROM server WHERE ID = ?").get(port);
};

exports.getAllServer = () => {
	return db.prepare("SELECT * FROM server").all();
};

exports.updateServer = (port, type, status, instance) => {
	const inDatabase = this.getFromID(port);
	inDatabase
		? type
			? db.prepare("UPDATE server SET type = ?, lastStatus = ?, updateTime = ? WHERE ID = ?").run(type, status, new Date().toLocaleString(), port)
			: db.prepare("UPDATE server SET lastStatus = ?, updateTime = ? WHERE ID = ?").run(status, new Date().toLocaleString(), port)
		: addServer(port, type, status, instance);
};

exports.remove = port => {
	db.prepare("DELETE FROM server WHERE ID = ?").run(port);
};
