import ApplicationDetail, { ApplicationDetailModel } from "@services/applicationDetail";
class DependenciesInjection {
    private static instance: DependenciesInjection;
    public applicationDetail: ApplicationDetailModel = new ApplicationDetailModel();
    public static getInstance(): DependenciesInjection {
        if (!DependenciesInjection.instance) {
            DependenciesInjection.instance = new DependenciesInjection();
        }
        return DependenciesInjection.instance;
    };

    private _nodeTLSUnAuthorizedRejection: boolean = false;
    public get nodeTLSUnAuthorizedRejection() { return this._nodeTLSUnAuthorizedRejection };
    public set nodeTLSUnAuthorizedRejection(_nodeTLSUnAuthorizedRejection: boolean) { this._nodeTLSUnAuthorizedRejection = _nodeTLSUnAuthorizedRejection };

    public initInstance() {
        ApplicationDetail();
    };

    public allowNodeTLSUnAuthorizedRejection() {
        const isAllow = this.nodeTLSUnAuthorizedRejection;
        if (!isAllow) {
            process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = '1';
            this.nodeTLSUnAuthorizedRejection = process.env["NODE_TLS_REJECT_UNAUTHORIZED"] == '1';
        }
        return this.nodeTLSUnAuthorizedRejection;
    };

    public disAllowNodeTLSUnAuthorizedRejection() {
        const isdisAllow = this.nodeTLSUnAuthorizedRejection == false;
        if (isdisAllow) {
            process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = '0';
            this.nodeTLSUnAuthorizedRejection = (!Boolean(process.env["NODE_TLS_REJECT_UNAUTHORIZED"] == '0'));
        }
        return this.nodeTLSUnAuthorizedRejection;
    };

};

export { DependenciesInjection };
export default DependenciesInjection;