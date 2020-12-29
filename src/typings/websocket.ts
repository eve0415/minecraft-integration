type LogEventType = 'AUTH' | 'LOGIN' | 'KICK' | 'KICKEDFROM' | 'DISCONNECT' | 'PRECONNECT' | 'POSTCONNECT';

export type StatusType= 'OFFLINE' | 'CONNECT' | 'START' | 'STOP' | 'UPDATE';
export type RecieveEventName = '';

interface basicData {
    port: string
}

interface websocketEvents {
    'statusUpdate': [StatusType, StatusData]
    'log': [LogData]
    'serverInfo': [unknown]
    'advancementAchieve': [unknown]
    'disconnect': [string]
    'error': [Error]
}

export interface StatusData extends basicData {
    platform: string
    totalMemory: string
    usedMemory: string
    freeMermory: string
    uptime: string
    onlinePlayers?: string
    maxPlayers?: string
    tps?: string
}

export interface LogData extends basicData {
    event: LogEventType
    name: string
    UUID?: string
    ip: string
    type?: string
    version?: string
    mods?: string
    reason?: string
    fulfill?: string
    currentServer?: string
    toServer?: string
    fromServer?: string
}

export type WebsocketEvents = websocketEvents;