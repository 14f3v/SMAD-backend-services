import Config from '@constants/configs';
import RedisEmittion from '@constants/redisEmittion';
import { createClient, type RedisClientType } from 'redis';
import InitializePool from './InitializePools';
import DependenciesInjection from '@services/dependenciesInjection';

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

    public jsonSerialize(context: any) {
        if (typeof context == 'string') context = JSON.parse(context);
        else context = JSON.stringify(context)

        return context;
    };

    public async broadcastingNewApplicationInstanceMember(conext?: any) {
        this.publisher.publish(RedisEmittion.LISTEN_MESSAGE, this.jsonSerialize(this.dependenciesInjection.applicationDetail));
        // logger.info(this.jsonSerialize(this.dependenciesInjection.applicationDetail))
    }

    public async publishNewConnectionPoolMember() {
        console.log('[', 'publish', RedisEmittion.INITIALIZE_CONNECTION_POOL_MEMBER, ']', this.dependenciesInjection.applicationDetail);
        await this.publisher?.publish(RedisEmittion.INITIALIZE_CONNECTION_POOL_MEMBER, 'hello');
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
};

const redisConnection: any = /* appsettings.redisConnection */ {
    url: ['redis://', Config.REDIS_HOST, ':', Config.REDIS_PORT].join(''),

} as any;


export default RedisServices;
export { RedisServices, redisConnection };