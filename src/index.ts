import Config from '@constants/configs';
import SocketIOEmittion from '@constants/socketIOemittion';
import { socketIO, server, app } from '@server';
import DependenciesInjection from '@services/dependenciesInjection';
import SocketIOService from '@services/socketIOService';
export default (() => {
    server.listen(Config.APPLICATION_PORT, new DependenciesInjection().initInstance);
    socketIO.sockets.on(SocketIOEmittion.CONNECT, (socket) => new SocketIOService(socket).initialize())
    return;
})();