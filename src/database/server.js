const db = require('better-sqlite3')('data/minecraft.sqlite3');

const addServer = (port, type, instance) => {
  const addCache = db.prepare('INSERT INTO server VALUES (@ID, @type, @name)');
  addCache.run({
    ID: port,
    type: type,
    name: null,
  });
  instance.statusPage.addStatus(port);
};

exports.getFromID = port => {
  return db.prepare('SELECT * FROM server WHERE ID = ?').get(port);
};

exports.getAllServer = () => {
  return db.prepare('SELECT * FROM server').all();
};

exports.updateServer = (port, type, instance) => {
  const inDatabase = this.getFromID(port);
  if (inDatabase?.type === type || !type) return;
  inDatabase
    ? db.prepare('UPDATE server SET type = ? WHERE ID = ?').run(type, port)
    : addServer(port, type, instance);
};

exports.setName = (port, name) => {
  db.prepare('UPDATE server SET name = ? WHERE ID = ?').run(name, port);
};

exports.remove = port => {
  db.prepare('DELETE FROM server WHERE ID = ?').run(port);
};
