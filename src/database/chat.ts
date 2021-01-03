import Database = require('better-sqlite3');
import { DBdata } from '../typings';

const db = Database('data/minecraft.sqlite3');

const addCache = (chID: string, serverID: number): void => {
    const addCh = db.prepare('INSERT INTO chat VALUES (@channelID, @serverID)');
    addCh.run({
        channelID: chID,
        serverID: serverID,
    });
};

const getFromID = (chID: string): DBdata[] => db.prepare('SELECT * FROM chat WHERE channelID = ?').all(chID) as DBdata[];

const getAll = (): DBdata[] => db.prepare('SELECT * FROM chat').all() as DBdata[];

const removeCache = (chID: string): void => {
    db.prepare('DELETE FROM chat WHERE channelID = ?').run(chID);
};

export { addCache, getFromID, getAll, removeCache };
