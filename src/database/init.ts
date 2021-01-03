import { statSync, mkdirSync } from 'fs';
import Database = require('better-sqlite3');

export const init = (): void => {
    try {
        statSync('./data');
    } catch {
        mkdirSync('./data');
    }

    const db = new Database('data/minecraft.sqlite3');

    db.prepare('CREATE TABLE IF NOT EXISTS server (ID numbers NOT NULL, type TEXT NOT NULL, name TEXT)').run();
    db.prepare('CREATE TABLE IF NOT EXISTS status (channelID TEXT NOT NULL, messageID TEXT NOT NULL)').run();
    db.prepare('CREATE TABLE IF NOT EXISTS chat (channelID TEXT NOT NULL, serverID numbers NOT NULL)').run();
    db.prepare('CREATE TABLE IF NOT EXISTS log (channelID TEXT NOT NULL, serverID numbers NOT NULL)').run();
};

export * as chat from './chat';
export * as log from './log';
export * as server from './server';
export * as status from './status';
