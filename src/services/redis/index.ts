import Config from '@constants/configs';
import { createClient, type RedisClientType } from 'redis';

class RedisServices {
    private static instance: RedisServices;
    public static getInstance(): RedisServices {
        if (!RedisServices.instance) {
            RedisServices.instance = new RedisServices();
        }
        return RedisServices.instance;
    };

    public subscriber(): RedisClientType {
        return createClient(redisConnection)
    };

    public publisher(): RedisClientType {
        return this.subscriber().duplicate(redisConnection)
    };
};


const redisConnection: any = /* appsettings.redisConnection */ {
    host: Config.REDIS_HOST,
    port: Config.REDIS_PORT
} as any;


export default RedisServices;
export { RedisServices, redisConnection };