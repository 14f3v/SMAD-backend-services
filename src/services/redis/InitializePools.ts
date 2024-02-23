import type { TODO_TYPE } from "src/types";
export default function InitializePool<T = undefined>(callback?: TODO_TYPE, channel?: string, message?: T) {
    console.log(['POST_SUB']);
    console.log('[', 'callback', ']', callback);
    console.log('[', 'channel', channel, ']', JSON.stringify(message, null, 4));
};
