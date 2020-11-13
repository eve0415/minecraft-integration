const db = require('better-sqlite3')('data/minecraft.sqlite3');

exports.addMessageCache = (chID, mesID) => {
  const add = db.prepare('INSERT INTO status VALUES (@channelID, @messageID)');
  add.run({
    channelID: chID,
    messageID: mesID,
  });
};

exports.getMessageCache = () => {
  return db.prepare('SELECT * FROM status').all();
};

exports.removeMessage = mesID => {
  db.prepare('DELETE FROM status WHERE messageID = ?').run(mesID);
};
