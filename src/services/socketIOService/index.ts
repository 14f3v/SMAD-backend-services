import type { DisconnectReason, Socket } from 'socket.io';
import SocketIOEmittion from '@constants/socketIOemittion';
import { hostname } from 'os';
let connectionPools: ConnectionPool[] = [];
export default class SocketIOService {
    private _socketInstance: Socket;
    // private connectionPools?: ConnectionPool[];
    public messageEmittion?: TMessageEmittion;
    constructor(socketInstance?: Socket) {
        this._socketInstance = socketInstance!;
    };
    private static instance: SocketIOService;
    public static getInstance(socketInstance?: Socket): SocketIOService {
        if (!SocketIOService.instance) {
            SocketIOService.instance = new SocketIOService(socketInstance);
        }
        return SocketIOService.instance;
    };

    public get socketInstance() { return this._socketInstance };
    public initialize() {
        this.listenOnNewUserRegistered();
        this.listenOnDisconnect();
        return;
    };

    private connectionSanitizer(socketId?: string) {
        connectionPools = connectionPools?.filter(({ socketId: SOCKETID }) => SOCKETID !== this._socketInstance.id);
    };

    private jsonSerialize<T = undefined>(conext: any): T {
        if (typeof conext == 'object') conext = JSON.stringify(conext);
        else conext = JSON.stringify(conext);
        return conext;
    }

    /**
     * broadcasting
     */
    public broadcastingUsersOnline() {
        this.messageEmittion = new MessageEmittion();
        this.messageEmittion.hostname = hostname();
        this.messageEmittion.message = connectionPools as any;
        this._socketInstance.emit(SocketIOEmittion.USERS_ONLINE, this.messageEmittion);
    };

    /**
     * listenOnNewUserRegistered
     */
    public listenOnNewUserRegistered() {
        this._socketInstance.on(SocketIOEmittion.USER_REGISTERED, (io: ConnectionPool) => {
            console.log('[ ' + SocketIOEmittion.USER_REGISTERED + ' ]: ' + this.jsonSerialize(io));
            const newConnection = new ConnectionPool();
            newConnection.socketId = this._socketInstance.id;
            newConnection.username = io.username;
            newConnection.hostname = hostname();
            connectionPools = [...connectionPools ?? [], newConnection];
            this.broadcastingUsersOnline();
        });
    }

    /**
     * listenOnDisconnect
     */
    public listenOnDisconnect() {
        this._socketInstance.on(SocketIOEmittion.DISCONNECT, (io: DisconnectReason) => {
            console.log('[ ' + SocketIOEmittion.DISCONNECT + ' ]: ' + this._socketInstance.id);
            this.connectionSanitizer();
        });
    }
};

class ConnectionPool {
    username: string;
    socketId: string;
    hostname: string;
    constructor(
        username?: string,
        socketId?: string,
        hostname?: string,
    ) {
        this.username = username!;
        this.socketId = socketId!;
        this.hostname = hostname!;
    }
};

interface IConnectionPool extends ConnectionPool { }

type TMessageEmittion<T = undefined> = IConnectionPool & {
    message: T
};

class MessageEmittion<T> implements TMessageEmittion<T> {
    username: string;
    socketId: string;
    message: T;
    hostname: string;
    constructor(
        username?: string,
        socketId?: string,
        message?: T,
        hostname?: string,
    ) {
        this.username = username!;
        this.socketId = socketId!;
        this.message = message!;
        this.hostname = hostname!;
    }
};

interface IMessageEmittion<T = undefined> extends MessageEmittion<T> { };