import type RedisEmittion from "@constants/redisEmittion";
export default function InitializePool<T = undefined>(callback?: any, channel?: string, message?: T) {
    console.log(['POST_SUB']);
    console.log('[', 'callback', ']', callback);
    console.log('[', 'channel', channel, ']', JSON.stringify(message, null, 4));
};
