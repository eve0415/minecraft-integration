const db = require('better-sqlite3')('data/minecraft.sqlite3');
// channelID TEXT NOT NULL, serverID TEXT
exports.addCache = (chID, serverID) => {
  const addCh = db.prepare('INSERT INTO chat VALUES (@channelID, @serverID)');
  addCh.run({
    channelID: chID,
    serverID : serverID,
  });
};

exports.getFromID = chID => {
  return db.prepare('SELECT * FROM chat WHERE channelID = ?').get(chID);
};

exports.getAll = () => {
  return db.prepare('SELECT * FROM chat').all();
};

exports.removeCache = chID => {
  db.prepare('DELETE FROM chat WHERE channelID').run(chID);
};

