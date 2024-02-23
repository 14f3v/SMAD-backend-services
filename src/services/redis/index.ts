import Config from '@constants/configs';
import RedisEmittion from '@constants/redisEmittion';
import SocketIOEmittion from '@constants/socketIOemittion';
import { createClient, type RedisClientType } from 'redis';
import InitializePool from './InitializePools';
import DependenciesInjection from '@services/dependenciesInjection';
import type { TODO_TYPE } from 'src/types';

class RedisServices {
    private static instance: RedisServices;
    private dependenciesInjection = DependenciesInjection.getInstance();
    public connection: RedisClientType = createClient(redisConnection);
    public subscriber: RedisClientType/*  = this.connection.duplicate() */;
    public publisher: RedisClientType/*  = this.connection.duplicate() */;
    constructor() {
        this.subscriber = this.connection.duplicate()
        this.publisher = this.subscriber.duplicate()
        this.initialize();
    }
    public static getInstance(): RedisServices {
        if (!RedisServices.instance) {
            RedisServices.instance = new RedisServices();
        }
        return RedisServices.instance;
    };

    public jsonSerialize(context: TODO_TYPE) {
        if (typeof context == 'string') context = JSON.parse(context);
        else context = JSON.stringify(context);
        return context;
    };

    public async broadcastingNewApplicationInstanceMember(conext?: TODO_TYPE) {
        this.publisher.publish(RedisEmittion.LISTEN_MESSAGE, this.jsonSerialize(this.dependenciesInjection.applicationDetail));
    }

    public async publishNewConnectionPoolMember() {
        console.log('[', 'publish', RedisEmittion.INITIALIZE_CONNECTION_POOL_MEMBER, ']', this.dependenciesInjection.applicationDetail);
        this.publisher.publish(RedisEmittion.INITIALIZE_CONNECTION_POOL_MEMBER, 'hello');
    };

    private async subscriptionOnClientConnectionPool() {
        this.subscriber.subscribe(RedisEmittion.INITIALIZE_CONNECTION_POOL_MEMBER, message => {
            console.log('[', RedisEmittion.INITIALIZE_CONNECTION_POOL_MEMBER, ']:', this.jsonSerialize(message));
        });
    };

    public async initialize() {
        await this.subscriber.connect();
        await this.publisher.connect();
        this.subscriber.on(RedisEmittion.LISTEN_MESSAGE, InitializePool);
        this.subscriptionOnClientConnectionPool();
    };

    /**
     * publishInterNodeMeesageMessage
     */
    public publishInterNodeMeesageMessage(socketIOemittion: SocketIOEmittion, message: TODO_TYPE) {
        console.log('[ [REDIS].[INTER_NODE].[EMIT]:', socketIOemittion, ']:', this.jsonSerialize(message));
        this.publisher.publish(socketIOemittion, this.jsonSerialize(message));
    };

    /**
     * listenOnInterNodeMeesageMessage
     */
    public listenOnInterNodeMeesageMessage<T = undefined>(callback?: T | TODO_TYPE) {
        this.subscriber.subscribe(SocketIOEmittion.CHAT_MESSAGE, (message) => {
            console.log('[ [REDIS].[INTER_NODE].[RECIVED]:', SocketIOEmittion.CHAT_MESSAGE, ']:', this.jsonSerialize(message));
            if (callback) callback(this.jsonSerialize(message));
        });
    };
};

const redisConnection: TODO_TYPE = /* appsettings.redisConnection */ {
    url: ['redis://', Config.REDIS_HOST, ':', Config.REDIS_PORT].join(''),
} as any;


export default RedisServices;
export { RedisServices, redisConnection };