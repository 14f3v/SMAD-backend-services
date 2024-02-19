import Config from '@constants/configs';
import { name, version } from '../../../package.json';
import os from 'os';
import DependenciesInjection from '@services/dependenciesInjection';
export default function ApplicationDetail(): TApplicationDetail {

    const dependenciesInjection =  DependenciesInjection.getInstance();
    const hostname = os.hostname();
    // const context: ApplicationDetailModel = new ApplicationDetailModel();
    dependenciesInjection.applicationDetail.name = name;
    dependenciesInjection.applicationDetail.version = version;
    dependenciesInjection.applicationDetail.hostname = hostname;
    dependenciesInjection.applicationDetail.port = Config.APPLICATION_PORT;
    Object.entries(dependenciesInjection.applicationDetail).map(([key, values]) => console.log('[', key.toUpperCase(), ']:', values));
    return dependenciesInjection.applicationDetail;
};

type TApplicationDetail = {
    name: string,
    version: string,
    hostname: string,
    port: Config,
};

class ApplicationDetailModel implements TApplicationDetail {
    name: string;
    version: string;
    hostname: string;
    port: Config;
    constructor(
        name?: string,
        version?: string,
        hostname?: string,
        port?: Config,
    ) {
        this.name = name!;
        this.version = version!;
        this.hostname = hostname!;
        this.port = port!;
    }
}

export { ApplicationDetailModel };
export type { TApplicationDetail };