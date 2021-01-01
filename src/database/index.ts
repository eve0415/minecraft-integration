import { statSync, mkdirSync } from 'fs';
import Database from 'better-sqlite3';

export function init(): void {
    try {
        statSync('./data');
    } catch {
        mkdirSync('./data');
    }

    const db = Database('data/minecraft.sqlite3');

    db.prepare('CREATE TABLE IF NOT EXISTS server (ID numbers NOT NULL, type TEXT NOT NULL, name TEXT)').run();
    db.prepare('CREATE TABLE IF NOT EXISTS status (channelID TEXT NOT NULL, messageID TEXT NOT NULL)').run();
    db.prepare('CREATE TABLE IF NOT EXISTS chat (channelID TEXT NOT NULL, serverID numbers NOT NULL)').run();
    db.prepare('CREATE TABLE IF NOT EXISTS log (channelID TEXT NOT NULL, serverID numbers NOT NULL)').run();
}

export * as chat from './chat';
export * as log from './log';
export * as server from './server';
export * as status from './status';
