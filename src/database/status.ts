import Database = require('better-sqlite3');
import { DBstatus } from '../typings';

const db = Database('data/minecraft.sqlite3');

const addMessageCache = (chID: string, mesID: string): void => {
    const add = db.prepare('INSERT INTO status VALUES (@channelID, @messageID)');
    add.run({
        channelID: chID,
        messageID: mesID,
    });
};

const getMessageCache = (): DBstatus[] => db.prepare('SELECT * FROM status').all() as DBstatus[];

const removeMessage = (mesID: string): void => {
    db.prepare('DELETE FROM status WHERE messageID = ?').run(mesID);
};

export { addMessageCache, getMessageCache, removeMessage };
