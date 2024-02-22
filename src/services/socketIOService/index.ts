import type { DisconnectReason, Socket } from 'socket.io';
import SocketIOEmittion from '@constants/socketIOemittion';
import { hostname } from 'os';
import Repositories, { Message } from '@repos/index';
let connectionPools: ConnectionPool[] = [];
export default class SocketIOService {
    private _socketInstance: Socket;
    public messageEmittion?: TMessageEmittion;
    private repositories: Repositories = new Repositories();
    constructor(socketInstance?: Socket) {
        this._socketInstance = socketInstance!;
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
        this._socketInstance.broadcast.emit(SocketIOEmittion.USERS_ONLINE, this.messageEmittion);
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
            this.repositories.addUser(newConnection);
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
            const senderUser = connectionPools.find(({ socketId }) => socketId == this._socketInstance.id);
            const validMessage = new Message();
            validMessage.message = message.message;
            validMessage.to_username = message.username;
            if (senderUser) {
                const { username: senderUsername } = senderUser;
                validMessage.username = senderUsername;
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