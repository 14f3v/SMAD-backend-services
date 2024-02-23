import '../pre-start';
import Config from '@constants/configs';
import SocketIOEmittion from '@constants/socketIOemittion';
import { socketIO, server, app } from '@server';
import DependenciesInjection from '@services/dependenciesInjection';
import SocketIOService from '@services/socketIOService';

export default (async () => {
    server.listen(Config.APPLICATION_PORT, new DependenciesInjection().initInstance);
    socketIO.on(SocketIOEmittion.CONNECTION, (socket) => new SocketIOService(socket));
    return;
})();