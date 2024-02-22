class Repositories {

    private databases: any;
    constructor() { };

    public getUsers() { };
    public addUser() { };
    public findUser() { };
    public findManyUsers() { };

    public getMessages() { };
    public postMessage() { };
    public findMessagesByUser() { };

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
    from_username: IUser['username'];
    to_username: IUser['username'];
    message: string;
    constructor(from_username?: IUser['username'], to_username?: IUser['username'], message?: string) {
        this.from_username = from_username!;
        this.to_username = to_username!;
        this.message = message!;
    }
}; interface IMessage extends Message { }


export type { IRepositories };
export default Repositories;