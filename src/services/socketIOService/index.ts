import type { DisconnectReason, Socket } from 'socket.io';
import SocketIOEmittion from '@constants/socketIOemittion';
import { hostname } from 'os';
import Repositories, { Message } from '@repos/index';
import RedisServices from '@services/redis';
let connectionPools: ConnectionPool[] = [];

class WebsocketConnectionPool {
    private static instance: WebsocketConnectionPool;
    public pools: WebSocketConnectionPool[] = [];
    public static getInstance(): WebsocketConnectionPool {
        if (!WebsocketConnectionPool.instance) {
            WebsocketConnectionPool.instance = new WebsocketConnectionPool();
        }
        return WebsocketConnectionPool.instance;
    };

};

export default class SocketIOService {
    private _socketInstance: Socket;
    public messageEmittion?: TMessageEmittion;
    private repositories: Repositories = new Repositories();
    private redisServices: RedisServices/*  = RedisServices.getInstance() */;
    private clientConnection: WebsocketConnectionPool;
    constructor(socketInstance?: Socket) {
        this._socketInstance = socketInstance!;
        this.redisServices = RedisServices.getInstance();
        this.clientConnection = WebsocketConnectionPool.getInstance();
        this.initialize();
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
        this.listenOnChatMessage();
        this.listenChatHistories();
        return;
    };

    private connectionSanitizer(socketId?: string) {
        this.clientConnection.pools = this.clientConnection.pools?.filter(({ socketId: SOCKETID }) => SOCKETID !== this._socketInstance.id);
        // connectionPools = connectionPools?.filter(({ socketId: SOCKETID }) => SOCKETID !== this._socketInstance.id);
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
        console.log('broadcastingUsersOnline', this.clientConnection.pools.map(({ socket, ...element }) => element))
        // console.log('broadcastingUsersOnline connectionPools', connectionPools.map(({ ...element }) => element))
        this.messageEmittion = new MessageEmittion();
        this.messageEmittion.hostname = hostname();
        this.messageEmittion.message = this.clientConnection.pools as any;
        // this.messageEmittion.message = connectionPools as any;
        this._socketInstance.emit(SocketIOEmittion.USERS_ONLINE, this.messageEmittion); // ? emit back to socket
        this._socketInstance.broadcast.emit(SocketIOEmittion.USERS_ONLINE, this.messageEmittion); // ? broadcast emittion to another socket
    };

    /**
     * listenOnNewUserRegistered
     */
    public listenOnNewUserRegistered() {
        this._socketInstance.on(SocketIOEmittion.USER_REGISTERED, (io: ConnectionPool) => {
            console.log('[ ' + SocketIOEmittion.USER_REGISTERED + ' ]: ' + this.jsonSerialize(io));
            const webSocketConnectionPool = new WebSocketConnectionPool();
            /* 
            const newConnection = new ConnectionPool();
            newConnection.socketId = this._socketInstance.id;
            newConnection.username = io.username;
            newConnection.hostname = hostname(); 
            */
            webSocketConnectionPool.socketId = this._socketInstance.id;
            webSocketConnectionPool.username = io.username;
            webSocketConnectionPool.hostname = hostname();
            // webSocketConnectionPool.socket = this._socketInstance;
            this.clientConnection.pools = [...this.clientConnection.pools ?? [], webSocketConnectionPool]; // ? TODO: this should be turn into a complete datbase integration in session table
            // connectionPools = [...connectionPools ?? [], webSocketConnectionPool]; // ? TODO: this should be turn into a complete datbase integration in session table
            /* //? fact: better store a connection pool member into redis[EX] */
            this.repositories.addUser(/* newConnection */webSocketConnectionPool);
            this.broadcastingUsersOnline();
        });
    };

    /**
     * listenOnDisconnect
     */
    public listenOnDisconnect() {
        this._socketInstance.on(SocketIOEmittion.DISCONNECT, (io: DisconnectReason) => {
            console.log('[ ' + SocketIOEmittion.DISCONNECT + ' ]: ' + this._socketInstance.id);
            this.connectionSanitizer();
        });
    };

    /**
     * messageChat
     */
    public listenOnChatMessage() {
        this._socketInstance.on(SocketIOEmittion.CHAT_MESSAGE, (message) => {
            const senderUser = this.clientConnection.pools.find(({ socketId }) => socketId == this._socketInstance.id);
            const destinationReciver = this.clientConnection.pools.find(({ username }) => username == message.username);
            const validMessage = new Message();
            validMessage.message = message.message;
            validMessage.to_username = message.username;
            if (senderUser) {
                const { username: senderUsername } = senderUser;
                validMessage.username = senderUsername;
            }

            if (destinationReciver) {
                // this._socketInstance
                console.log('[', 'EMIT DIRECT MESSAGE', ']', validMessage, '\n');
            }

            else {
                // ? implement publishing message via redis pub/sub paradigm here!!
                console.log('[', 'PUBLISH MESSAGE THROUGHT OUT', ']', validMessage, '\n');
            }

            this.repositories.postMessage(message);
        });
    };

    /**
     * listenChatHistories
     */
    public listenChatHistories() {
        this._socketInstance.on(SocketIOEmittion.CHAT_HISTORIES, (user: ConnectionPool) => {
            console.log('[', SocketIOEmittion.CHAT_HISTORIES, ']:', user);
            const chatMessages = this.repositories.getMessages(user);
            this._socketInstance.emit(SocketIOEmittion.CHAT_HISTORIES, chatMessages);
        })
    };
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

class WebSocketConnectionPool extends ConnectionPool {
    socket: Socket;
    constructor(
        username?: string,
        socketId?: string,
        hostname?: string,
        socket?: Socket,
    ) {
        super(username, socketId, hostname);
        this.socket = socket!;
    }
};

interface IWebSocketConnectionPool extends WebSocketConnectionPool { }