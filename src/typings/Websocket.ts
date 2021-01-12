type LogEventType = 'AUTH' | 'LOGIN' | 'KICK' | 'KICKEDFROM' | 'DISCONNECT' | 'PRECONNECT' | 'POSTCONNECT';

export type StatusType = 'OFFLINE' | 'CONNECT' | 'START' | 'STOP' | 'UPDATE';

export type port = string | null;

interface basicData {
    port: number
}

interface websocketEvents {
    'statusUpdate': [StatusType, StatusData]
    'log': [LogData]
    'serverInfo': [ServerInfo]
    'chat': [ChatData]
    'advancementAchieve': [unknown]
    'connect': [port]
    'disconnect': [port, string]
    'error': [port, Error]
}

export interface StatusData extends basicData {
    platform: string
    totalMemory: string
    usedMemory: string
    freeMemory: string
    uptime: string
    onlinePlayers?: number
    maxPlayers?: number
    tps?: number
}

export interface LogData extends basicData {
    event: LogEventType
    name: string
    UUID?: string
    ip: string
    address: string
    type?: string
    version?: string
    mods?: string
    reason?: string
    fulfill?: string
    currentServer?: string
    toServer?: string
    fromServer?: string
}

export interface ChatData extends basicData {
    name: string
    UUID: string
    message: string
}

export interface ServerInfo {
    [key: number]: string
}

export type WebsocketEvents = websocketEvents;
