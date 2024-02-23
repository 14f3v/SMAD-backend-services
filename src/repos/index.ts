import { Database } from "bun:sqlite";
import type { TODO_TYPE } from "src/types";

class Repositories {
    private databases: Database;
    constructor() {
        this.databases = new Database("./src/repos/storage.sqlite");
        this.init();
    };

    private async init() {
        try {
            const initTableUsers = await Bun.file('./src/repos/initTable_USERS.sql').text();
            const initTableMessages = await Bun.file('./src/repos/initTable_MESSAGE.sql').text();
            this.databases.query(initTableUsers).run();
            this.databases.query(initTableMessages).run();
            console.log({ ['DATABASES CONNECTED']: Boolean(this.databases) });
        }
        catch (Exception: TODO_TYPE) {
            throw new Error(Exception);
        }
    };

    public getUsers(): IUser[] {
        const users: IUser[] = this.databases.query(`SELECT * FROM USERS`).all() as IUser[];
        return users;
    };

    public addUser(user: User): boolean {
        let isAddUserOK: boolean = false;
        try {
            const { username } = user;
            try {
                this.databases.query(`INSERT INTO USERS(username) VALUES ('${username}')`).run();
                isAddUserOK = true;
            }
            catch (Exception) {
                console.log('[ EXCEPTION ]:', 'User already exist');
            }
        }

        catch (Exception: TODO_TYPE) {
            throw new Error(Exception)
        }
        return isAddUserOK;
    };

    public findUser(user: User): User | null {
        let validUser: User | null = null;
        const { username } = user;
        try {
            validUser = this.databases.query(`SELECT username, to_username, message FROM MESSAGES WHERE username = '${username}'`).get() as typeof validUser;
        }
        catch (Exception) {
            console.log('[ EXCEPTION ]:', 'Unable to get user');
        }
        return validUser;
    };

    public findManyUsers(users: User[]): IUser[] | [] {
        let validUser: IUser[] = [];
        try {
            validUser = this.databases.query(`SELECT username, to_username, message FROM MESSAGES WHERE username IN (${users.map(({ username }) => username).join(', ')})`).get() as typeof validUser;
        }
        catch (Exception) {
            console.log('[ EXCEPTION ]:', 'Unable to find many users');
        }
        return validUser;
    };

    public getMessages(user: IUser): Message[] {
        let messages: Message[] = [];
        const { username } = user;
        try {
            messages = this.databases.query(`SELECT username, to_username, message FROM MESSAGES WHERE username = '${username}'`).all() as Message[];
        }
        catch (Exception) {
            console.log('Exception:', 'Unable to get messages');
        }

        return messages;
    };

    public postMessage(messages: Message) {
        let isAddUserOK: boolean = false;
        try {
            const { username, message, to_username } = messages;
            try {
                this.databases.query(`INSERT INTO MESSAGES (username, to_username, message) VALUES ('${username}', '${to_username}', '${message}')`).run();
                isAddUserOK = true;
            }
            catch (Exception) {
                console.log('Exception', 'Unable to post message');
            }
        }


        catch (Exception: TODO_TYPE) {
            throw new Error(Exception)
        }
        return isAddUserOK;
    };

    // ? for expand a show case to multi rooms
    public getRooms() { };
    public findRooms() { };
    public createRoom() { };
    public leaveRoom() { };
    public joinRoom() { };
    public findRoomMember() { };
};

interface IRepositories extends Repositories { };

class User {
    username: string;
    constructor(username?: string) {
        this.username = username!;
    }
}; interface IUser extends User { };

class Message {
    username: IUser['username'];
    to_username: IUser['username'];
    message: string;
    constructor(username?: IUser['username'], to_username?: IUser['username'], message?: string) {
        this.username = username!;
        this.to_username = to_username!;
        this.message = message!;
    }
}; interface IMessage extends Message { };

class ReposHeaders {
    users: User[] = [];
    messages: Message[] = [];
    constructor(
        users?: User[],
        messages?: Message[],
    ) {
        this.users = users!;
        this.messages = messages!;
    }
}; interface IReposHeaders extends ReposHeaders { }


export { Message };
export type { IRepositories, IMessage };
export default Repositories;