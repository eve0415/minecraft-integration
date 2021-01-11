import Database = require('better-sqlite3');
import { DBdata } from '../typings';

const db = Database('data/minecraft.sqlite3');

const addCache = (chID: string, serverID: number): void => {
    const addCh = db.prepare('INSERT INTO log VALUES (@channelID, @serverID)');
    addCh.run({
        channelID: chID,
        serverID: serverID,
    });
};

const getFromID = (chID: string): DBdata[] => db.prepare('SELECT * FROM log WHERE channelID = ?').all(chID) as DBdata[];

const getAll = (): DBdata[] => db.prepare('SELECT * FROM log').all() as DBdata[];

const removeCache = (chID: string): void => {
    db.prepare('DELETE FROM log WHERE channelID = ?').all(chID);
};

export { addCache, getFromID, getAll, removeCache };
