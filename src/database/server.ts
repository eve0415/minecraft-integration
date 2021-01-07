import Database = require('better-sqlite3');
import { DBserver } from '../typings';

const db = Database('data/minecraft.sqlite3');

const addServer = (port: number, type: string): void => {
    const addCache = db.prepare('INSERT INTO server VALUES (@ID, @type, @name)');
    addCache.run({
        ID: port,
        type: type,
        name: null,
    });
};

const getFromID = (port: number): DBserver => db.prepare('SELECT * FROM server WHERE ID = ?').get(port) as DBserver;

const getAllServer = (): DBserver[] => db.prepare('SELECT * FROM server').all() as DBserver[];

const updateServer = (port: number, type: string): void => {
    const inDatabase = getFromID(port);
    const test = { ID: port, type: type } as DBserver;
    if (test.ID === inDatabase.ID && test.type === inDatabase.type) return;
    if (inDatabase) {
        db.prepare('UPDATE server SET type = ? WHERE ID = ?').run(type, port);
    } else {
        addServer(port, type);
    }
};

const setName = (port: number, name: string): void => {
    db.prepare('UPDATE server SET name = ? WHERE ID = ?').run(name, port);
};

const remove = (port: number): void => {
    db.prepare('DELETE FROM server WHERE ID = ?').run(port);
};

export { getFromID, getAllServer, updateServer, setName, remove };
