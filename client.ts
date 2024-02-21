import SocketIOEmittion from '@constants/socketIOemittion';
import { io as socketIOCreateClient } from 'socket.io-client';
const socket = socketIOCreateClient('ws://host.hyperscaleapplicationshowcase.com:3000').connect();

class UserModel {
    username: string;
    socketId: string;
    constructor(
        username?: string,
        socketId?: string,
    ) {
        this.username = username!;
        this.socketId = socketId!;
    }
};

const user = new UserModel();
user.username = 'test';
user.socketId = socket.id!;
socket.on(SocketIOEmittion.CONNECT, () => {
    user.socketId = socket.id!;
    socket.emit(SocketIOEmittion.USER_REGISTERED, user);
});

socket.on(SocketIOEmittion.USERS_ONLINE, (callback) => {
    console.log(JSON.stringify(callback, null, 4));
})