import Config from '@constants/configs';
import SocketIOEmittion from '@constants/socketIOemittion';
import { socketIO, server, app } from '@server';
import RedisServices from '@services/redis';
import DependenciesInjection from '@services/dependenciesInjection';
import SocketIOService from '@services/socketIOService';
const redisServices = RedisServices.getInstance();

export default (async () => {
    server.listen(Config.APPLICATION_PORT, new DependenciesInjection().initInstance);
    return;
})().then(async function () {
    socketIO.sockets.on(SocketIOEmittion.CONNECT, (socket) => new SocketIOService(socket).initialize());
    await redisServices.initialize().then(async (ref) => await redisServices.broadcastingNewApplicationInstanceMember());
});