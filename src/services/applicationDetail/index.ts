import Config from '@constants/configs';
import { name, version } from '../../../package.json';
import os from 'os';
export default function ApplicationDetail(): TApplicationDetail {

    const hostname = os.hostname();
    const context = {
        name,
        version,
        hostname: hostname,
        port: Config.APPLICATION_PORT
    };

    Object.entries(context).map(([key, values]) => console.log('[', key.toUpperCase(), ']:', values));
    return context;
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
        name: string,
        version: string,
        hostname: string,
        port: Config,
    ) {
        this.name = name;
        this.version = version;
        this.hostname = hostname;
        this.port = port;
    }
}

export { ApplicationDetailModel };
export type { TApplicationDetail };