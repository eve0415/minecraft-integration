const { statSync, mkdirSync } = require('fs');

try {
  statSync('./data');
} catch {
  mkdirSync('./data');
}

const db = require('better-sqlite3')('data/minecraft.sqlite3');

db.prepare('CREATE TABLE IF NOT EXISTS server (ID numbers NOT NULL, type TEXT NOT NULL, name TEXT)').run();
db.prepare('CREATE TABLE IF NOT EXISTS status (channelID TEXT NOT NULL, messageID TEXT NOT NULL)').run();
db.prepare('CREATE TABLE IF NOT EXISTS chat (channelID TEXT NOT NULL, serverID numbers NOT NULL)').run();
db.prepare('CREATE TABLE IF NOT EXISTS log (channelID TEXT NOT NULL, serverID numbers NOT NULL)').run();

const status  = require('./status');
const server  = require('./server');
const chat    = require('./chat');
const log     = require('./log');

module.exports = {
  addStatusMesCache   : status.addMessageCache,
  getStatusMesCache   : status.getMessageCache,
  removeStatusMessage : status.removeMessage,
  
  addChannelCache   : chat.addCache,
  getFromChannelID  : chat.getFromID,
  getAllChannelCache: chat.getAll,
  removeChannelCache: chat.removeCache,
  
  getFromPort : server.getFromID,
  getAllServer: server.getAllServer,
  updateServer: server.updateServer,
  removeServer: server.remove,
  
  addChannelLog       : log.addCache,
  getChannelLogFromID : log.getFromID,
  getAllChannelLog    : log.getAll,
  removeChannelLog    : log.removeCache,
};
