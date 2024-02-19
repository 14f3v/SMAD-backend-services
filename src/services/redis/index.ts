import Config from '@constants/configs';
import RedisEmittion from '@constants/redisEmittion';
import { createClient, type RedisClientType } from 'redis';
import InitializePool from './InitializePools';
import DependenciesInjection from '@services/dependenciesInjection';

class RedisServices {
    private static instance: RedisServices;
    private dependenciesInjection = DependenciesInjection.getInstance();
    public connection: RedisClientType = createClient(redisConnection);
    public subscriber?: RedisClientType/*  = this.connection.duplicate() */;
    public publisher?: RedisClientType/*  = this.connection.duplicate() */;
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

    public async broadcastingNewApplicationInstanceMember() {
        await this.publisher?.publish(RedisEmittion.LISTEN_MESSAGE, this.jsonSerialize(this.dependenciesInjection.applicationDetail));
        console.log(this.jsonSerialize(this.dependenciesInjection.applicationDetail))
    }

    public async publishNewConnectionPoolMember() {
        console.log('[', 'publish', RedisEmittion.INITIALIZE_CONNECTION_POOL_MEMBER, ']', this.dependenciesInjection.applicationDetail);
        await this.publisher?.publish(RedisEmittion.INITIALIZE_CONNECTION_POOL_MEMBER, 'hello');
    };

    public async initialize() {
        this.subscriber = this.connection.duplicate()
        this.publisher = this.subscriber.duplicate()
        await this.subscriber.connect();
        await this.publisher.connect();
        this.subscriber.on(RedisEmittion.LISTEN_MESSAGE, InitializePool);
        this.subscriber.on(RedisEmittion.INITIALIZE_CONNECTION_POOL_MEMBER, message => {
            console.log('[', RedisEmittion.INITIALIZE_CONNECTION_POOL_MEMBER, ']:', this.jsonSerialize(message));
        });
        await this.subscriber.subscribe(RedisEmittion.INITIALIZE_CONNECTION_POOL_MEMBER, message => {
            console.log('[', RedisEmittion.INITIALIZE_CONNECTION_POOL_MEMBER, ']:', this.jsonSerialize(message));
        });

        // await this.broadcastingNewApplicationInstanceMember();
    };
};

const redisConnection: any = /* appsettings.redisConnection */ {
    url: ['redis://', Config.REDIS_HOST.toString(), ':', Config.REDIS_PORT.toString()].join(''),

} as any;


export default RedisServices;
export { RedisServices, redisConnection };