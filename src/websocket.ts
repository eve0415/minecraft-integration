import { EventEmitter as eventEmitter } from 'events';
import { Server, Socket as sock } from 'socket.io';
import { Instance, logger } from '.';
import { wsEventManager } from './managers';
import { ChatData, LogData, SendChat, ServerInfo, StatusData, WebsocketEvents } from './typings';

declare module 'events' {
    interface EventEmitter {
        emit<K extends keyof WebsocketEvents>(event: K, ...args: WebsocketEvents[K]): boolean
    }
}

declare module 'socket.io' {
    interface Socket {
        serverID: number | undefined
    }
}

export class websocketClient extends eventEmitter {
    public readonly instance: Instance;
    private readonly wsPort: number;
    private readonly server: Server;
    private readonly events: wsEventManager;

    public constructor(instance: Instance) {
        super();
        this.instance = instance;
        this.wsPort = instance.config.port;
        this.server = new Server();
        this.events = new wsEventManager(this);
    }

    public open(): void {
        logger.info(`Opening port ${this.wsPort} for websocket client to connect`);
        this.server.listen(this.wsPort);
    }

    public close(): Promise<void> {
        logger.info(`Closing port ${this.wsPort} and cleaning up`);
        this.server.sockets.sockets.forEach(socket => socket.disconnect(true));
        this.server.close();
        // Wait 1 second to fire and finish off disconnect events
        return new Promise(resolve => setTimeout(resolve, 1000));
    }

    public async init(): Promise<void> {
        this.register();
        logger.info('Initializing websocket server');
        await this.events.registerAll();
        logger.info('Initialize complete');
    }

    private register(): void {
        this.server.on('connection', (socket: sock) => {
            this.checkIfValid(socket);
            this.emit('connect', null);

            socket.on('error', err => this.emit('error', socket.serverID ?? null, err));

            socket.on('CHAT', (data: ChatData) => this.emit('chat', data));
            socket.on('ADVANCEMENT', data => this.emit('advancementAchieve', data));

            socket.on('LOG', (log: LogData) => this.emit('log', log));

            socket.on('SERVERINFO', (data: ServerInfo) => this.emit('serverInfo', data));

            socket.on('STARTING', (data: StatusData) => this.emit('statusUpdate', 'START', data));
            socket.on('STOPPING', (data: StatusData) => this.emit('statusUpdate', 'STOP', data));
            socket.on('STATUS', (data: StatusData) => this.emit('statusUpdate', 'UPDATE', data));

            socket.on('disconnect', reason => {
                this.emit('statusUpdate', 'OFFLINE', { port: Number(socket.serverID) } as StatusData);
                this.emit('disconnect', socket.serverID ?? null, reason);
            });

            socket.on('ROOM', async (roomID: string) => {
                await socket.join(roomID);
                socket.serverID = Number(roomID);
                this.emit('connect', socket.serverID);
                this.emit('statusUpdate', 'CONNECT', { port: socket.serverID } as StatusData);
            });
        });
    }

    public send(id: number, message: SendChat): void {
        this.server.sockets.sockets.forEach(s => {
            if (s.serverID === id) s.emit('chat', message);
        });
    }

    private checkIfValid(socket: sock) {
        setTimeout(() => {
            if (!socket.serverID) socket.disconnect(true);
        }, 10000);
    }
}
