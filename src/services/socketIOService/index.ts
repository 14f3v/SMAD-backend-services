import type { Socket } from 'socket.io';
import SocketIOEmittion from '@constants/socketIOemittion';
export default class SocketIOService {
    private _socketInstance: Socket;
    public messageEmittion?: TMessageEmittion;
    constructor(socket: Socket) {
        this._socketInstance = socket;
        console.log('[', 'SOCKET_CONNECTED', ']:', socket.id);
    }
    public get socketInstance() { return this._socketInstance };

    public initialize() {
        this.broadcasting();
        return;
    }

    /**
     * broadcasting
     */
    public broadcasting() {
        this.messageEmittion = new MessageEmittion({ sourceSocketId: this._socketInstance.id });
        this._socketInstance.emit(SocketIOEmittion.EMIT_NEW_USER_CONNTECTED, this.messageEmittion);
    }
};

type TMessageEmittion<T = undefined> = {
    header: {
        sourceSocketId: string
    },
    message: T
};

class MessageEmittion implements TMessageEmittion {
    header: { sourceSocketId: string; };
    message: undefined;
    constructor(
        header?: { sourceSocketId: string; },
        message?: undefined,
    ) {
        this.header = { sourceSocketId: header?.sourceSocketId! };
        this.message = message;
    }
};