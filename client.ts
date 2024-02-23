import SocketIOEmittion from '@constants/socketIOemittion';
import { getRandomSeed } from 'bun:jsc';
import { io as socketIOCreateClient } from 'socket.io-client';

class SpawnMinion {
    private socket;
    private user = new UserModel();
    private randomTime = Number(`${getRandomSeed().toString().split('')[0]}0000`);
    private usersOnline: UserModel[] = [];
    constructor(url?: string) {
        this.socket = socketIOCreateClient('ws://host.hyperscaleapplicationshowcase.com:3000', {
            transports: ['websocket']
        }).connect(); // ? this should be apply by url
        this.initialize();
        /* this.initializeEmitting(); */
    };

    private randomMath(): number {
        const ran = Math.random().toString().split('.')[1].split('');
        const number = Number([ran[0], ran[1]].join(''));
        console.log(number);
        // getRandomSeed().toString().split('')[0] // ? [deprecated]
        return number;
    };

    private initialize() {
        this.listenOnConnection();
        this.listenOnUserOnline();
        this.listenOnGreetingRandomOnlineUser();
        this.getUserData();
        // console.log(this.randomTime);
        const timeOut = setInterval(() => this.greetingRandomOnlineUser(), this.randomTime);
        // clearInterval(timeOut);
    };

    private initializeEmitting() {
        this.emitGetChatMessagesHistories();
    }

    private randomSentence() {
        // Define arrays of words for different parts of speech
        const subjects: string[] = ['The cat', 'The dog', 'A bird', 'The car'];
        const verbs: string[] = ['jumped', 'ran', 'flew', 'drove'];
        const objects: string[] = ['over the fence', 'across the street', 'into the house', 'through the park'];

        // Function to select a random element from an array
        function getRandomElement(array: string[]): string {
            const randomIndex = Math.floor(Math.random() * array.length);
            return array[randomIndex];
        }

        // Function to create a random sentence
        function createRandomSentence(): string {
            const subject = getRandomElement(subjects);
            const verb = getRandomElement(verbs);
            const object = getRandomElement(objects);
            return `${subject} ${verb} ${object}.`;
        }

        // Generate and print a random sentence
        return createRandomSentence();
    }

    private getUserData() {
        this.user.username = `user_test@${this.randomMath()}`;
        this.user.socketId = this.socket.id!;
    };

    public emitUserConnectionRegisted() {
        this.socket.emit(SocketIOEmittion.USER_REGISTERED, this.user);
    };

    public emitGetChatMessagesHistories() {
        this.socket.emit(SocketIOEmittion.CHAT_HISTORIES, this.user);
    };

    public listenOnChatMessagesHistories() {
        this.socket.on(SocketIOEmittion.CHAT_HISTORIES, (messages) => {
            console.log('[', SocketIOEmittion.CHAT_HISTORIES, ']:', messages)
        });
    };

    private listenOnConnection() {
        this.socket.on(SocketIOEmittion.CONNECT, () => {
            this.user.socketId = this.socket.id!;
            this.emitUserConnectionRegisted();
            this.emitGetChatMessagesHistories();
        });
    };

    private listenOnUserOnline() {
        this.socket.on(SocketIOEmittion.USERS_ONLINE, (callback) => {
            console.log(JSON.stringify(callback, null, 4));
            this.usersOnline = callback.message || [];
        });
    };

    private greetingRandomOnlineUser() {
        const randomUserIndex: number = Math.floor(Math.random() * this.usersOnline.length);
        const message = new MessageEmit();
        const randomUser: IUserModel = this.usersOnline[randomUserIndex];
        message.username = randomUser.username;
        message.socketId = randomUser.socketId;
        message.message = this.randomSentence();
        console.log('[', 'EMIT', SocketIOEmittion.CHAT_MESSAGE, ']:', message);
        this.socket.emit(SocketIOEmittion.CHAT_MESSAGE, message);
    };

    private listenOnGreetingRandomOnlineUser() {
        this.socket.on(SocketIOEmittion.CHAT_MESSAGE, (message: MessageEmit) => {
            console.log('[', 'RECIVED', SocketIOEmittion.CHAT_MESSAGE, ']:', message);
        });
    }
};
new SpawnMinion();


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

interface IUserModel extends UserModel { }

class MessageEmit implements IUserModel {
    username: string;
    socketId: string;
    message: any;
    constructor(
        username?: string,
        socketId?: string,
        message?: string,
    ) {
        this.username = username!;
        this.socketId = socketId!;
        this.message = message!;
    }
};

interface IMessageEmit extends MessageEmit { }