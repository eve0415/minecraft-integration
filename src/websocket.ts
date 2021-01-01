import { EventEmitter as eventEmitter } from 'events';
import { Server, Socket as sock } from 'socket.io';
import { logger } from '.';
import { wsEventManager } from './Managers';
import { ConfigInterface } from './config';
import { LogData, StatusData, WebsocketEvents } from './typings';

declare module 'events' {
    interface EventEmitter {
        emit<K extends keyof WebsocketEvents>(event: K, ...args: WebsocketEvents[K]): boolean
    }
}

declare module 'socket.io' {
    interface Socket {
        serverID: string | undefined
    }
}

export class websocketClient extends eventEmitter {
    private readonly config: ConfigInterface;
    private readonly server: Server;
    private readonly events: wsEventManager;

    constructor(config: ConfigInterface) {
        super();
        this.config = config;
        this.server = new Server();
        this.events = new wsEventManager(this);
    }

    public open(): void {
        logger.info(`Opening port ${this.config.port} for websocket client to connect`);
        this.server.listen(this.config.port);
    }

    public close(): void {
        logger.info(`Closing port ${this.config.port} and cleaning up`);
        this.server.sockets.sockets.forEach(socket => socket.disconnect(true));
        this.server.close();
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

            // socket.on('CHAT', data => this.instance.taskManager.sendWebhook(data));
            // socket.on('ADVANCEMENT', data => this.emit('advancementAchieve', data));

            socket.on('LOG', (log: LogData) => this.emit('log', log));

            socket.on('SERVERINFO', (data: StatusData) => this.emit('serverInfo', data));

            socket.on('STARTING', (data: StatusData) => this.emit('statusUpdate', 'START', data));
            socket.on('STOPPING', (data: StatusData) => this.emit('statusUpdate', 'STOP', data));
            socket.on('STATUS', (data: StatusData) => this.emit('statusUpdate', 'UPDATE', data));

            socket.on('disconnect', reason => {
                this.emit('statusUpdate', 'OFFLINE', { port: socket.serverID } as StatusData);
                this.emit('disconnect', socket.serverID ?? null, reason);
            });

            socket.on('ROOM', (roomID: string) => {
                socket.join(roomID);
                socket.serverID = roomID;
                this.emit('connect', roomID);
                this.emit('statusUpdate', 'CONNECT', { port: roomID } as StatusData);
            });
        });
    }

    private checkIfValid(socket: sock): void {
        setTimeout(() => {
            if (!socket.serverID) socket.disconnect(true);
        }, 10000);
    }
}
