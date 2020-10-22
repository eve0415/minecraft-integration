const { statSync, mkdirSync } = require('fs');

try {
  statSync('./data');
} catch {
  mkdirSync('./data');
}

const db = require('better-sqlite3')('data/minecraft.sqlite3');

db.prepare('CREATE TABLE IF NOT EXISTS server (ID numbers NOT NULL, type TEXT NOT NULL, name TEXT)').run();
db.prepare('CREATE TABLE IF NOT EXISTS status (channelID TEXT NOT NULL, messageID TEXT NOT NULL, serverID TEXT NOT NULL)').run();
db.prepare('CREATE TABLE IF NOT EXISTS chat (channelID TEXT NOT NULL, serverID TEXT NOT NULL)').run();

const status = require('./status');
const chat = require('./chat');
const server = require('./server');

module.exports = {
  addStatusMesCache: status.addMessageCache,
  getStatusMesCache: status.getMessageCache,
  removeStatusMessage: status.removeMessage,
	
  addChannelCache: chat.addCache,
  getFromChannelID: chat.getFromID,
  removeChannelCache: chat.removeCache,
	
  getFromPort: server.getFromID,
  getAllServer: server.getAllServer,
  updateServer: server.updateServer,
  removeServer: server.remove,
};
