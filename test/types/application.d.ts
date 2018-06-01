declare namespace sn.Types {
    export interface Icmdb_ci_spkg { }
    export interface Ix_avana_cmdb_amp_agent { }

}

// Custom global Script Include Interfaces
declare module sn {
    export module Server {
        export interface ICustomGlobalScopeUtils {
            new(): ICustomGlobalScopeUtils;
            sleep(ms: number): string;
        }
        export interface ICustomGlobalScope extends sn.Server.IGlobalScope {
            CustomGlobalScopeUtils: sn.Server.ICustomGlobalScopeUtils;
        }
    }
}

// Internal Script Include Interfaces
declare namespace avanade.ampcmdb {
    export interface ICmdbDecryptor {
        setSiteKey(sysId: string): boolean;
        getSiteKey(sysId: string): string;
        getSiteRdpStorageKey(sys_id: string): string;
        getSiteJobExecutorKeys(sysId: string): { storageKey: string, serviceBusKey: string };
        getAmpAgentUpdateConfigurationStorageKey(sysId: string): string;
    }

    export interface ICmdbAgentInstallationHelper {
        upgradeAgentToLatest(agentSysId: string, errors?: Array<string>, outParams?: x_avana_cmdb.IOutParams): x_avana_cmdb.IAgentConfigurationContainer;
        configureAgent(agentSysId: string, name: string, params: { [key: string]: string; }, agentSoftwarePackage: sn.Types.Icmdb_ci_spkg, instrumentationKey?: string): string;
        getAmpJobExecutorParams(agentSysId: string, outErrors?: Array<string>, outParams?: x_avana_cmdb.IOutParams): { [key: string]: string; };
        getAmpRDPParams(outErrors?: Array<string>): { [key: string]: string; };
        getAmpMonitoringParams(agentSysId: string, outErrors?: Array<string>): { [key: string]: string; };
        getInstallerBlobUri(agentSoftwareName: x_avana_cmdb.AgentSoftwareNameType): string;
        getAmpJobExecutorInstallScript(agentSysId: string, outErrors?: Array<string>, outParams?: x_avana_cmdb.IOutParams): string;
        getAmpRDPInstallScript(agentSysId: string, outErrors?: Array<string>): string;
        getMontitoringInstallScript(agentSysId: string, outErrors?: Array<string>): string;
        getRdpAgentInstallerConfig(agentSysId: string, outErrors?: Array<string>): { uri: string, parameters: string };
        getAgentInstallerConfig(agentSysId: string, outErrors?: Array<string>, outParams?: x_avana_cmdb.IOutParams): { uri: string, parameters: string };
    }

    export interface ICmdbAmpJobExecutor {
        configureCompany(azureAuthProfileSysId: string): void;
        configureSite(hybridSiteSysId: string): x_avana_cmdb.IConfigureSiteResult;
        configureAgent(hybridSiteSysId: string, agentId: string): string;
        getAgentParams(hybridSiteSysId: string, agentId: string, outErrors?: Array<string>): { [key: string]: string };
    }

    export interface ICmdbAmpAgentHelper {
        getAmpJobAgent(): sn.Types.Ix_avana_cmdb_amp_agent;
        getAmpMonAgent(): sn.Types.Ix_avana_cmdb_amp_agent;
        getAmpRdpAgent(): sn.Types.Ix_avana_cmdb_amp_agent;
    }

    export interface ICmdbAmpAgentReplicator {
        replicateToAllUpdateConfigs(): Array<string>;
        replicateToUpdateConfig(destinationStorageAccountName: string): Array<string>;
        getBlobSasUri(storageAccountName: string, storageAccountKey: string): string;
    }

    export interface ICmdbGraphHelper {
        createVertexObject: (current: any, operation?: string)=> avanade.ampcmdb.GraphMessage<avanade.ampcmdb.Vertex>;
        createRelationshipObject: (current: any, operation?: string)=> avanade.ampcmdb.GraphMessage<avanade.ampcmdb.Edge>;
        getIPAddressList: (ciSysId: any) => Array<string>;
        getEndpoints: (ciSysId: any) => Array<string>;
    }

    export type GraphMessage<T> = {
        operation: string;
        sys_id: string;
        sys_class_name: string;
        payload: T;
    }

    export type Vertex = {
        sys_id: string;
        sys_class_name: string;
        name: string;
        [key: string]: any;
    }

    export type Edge = {
        sys_id: string;
        child: Rel;
        parent: Rel;
        type: RelType;
    }

    export type Rel = {
        id: string;
        name: string;
        "class": string;
    }

    export type RelType = {
        id: string;
        name: string;
        reverseName: string;
    }
}

declare namespace x_avana_cmdb {

    // External Script Include Interfaces
    var CmdbDecryptor: ICmdbDecryptor;
    var CmdbAgentInstallationHelper: ICmdbAgentInstallationHelper;
    var CmdbAmpJobExecutor: ICmdbAmpJobExecutor;
    var CmdbGraphHelper: ICmdbGraphHelper;

    export interface ICmdbGraphHelper extends avanade.ampcmdb.ICmdbGraphHelper {
        new(): ICmdbGraphHelper;
    }
    export interface ICmdbDecryptor extends avanade.ampcmdb.ICmdbDecryptor {
        new(): ICmdbDecryptor;
    }

    export interface ICmdbAgentInstallationHelper extends avanade.ampcmdb.ICmdbAgentInstallationHelper {
        new(_siteSysId: string): ICmdbAgentInstallationHelper;
    }

    export interface ICmdbAmpJobExecutor extends avanade.ampcmdb.ICmdbAmpJobExecutor {
        new(_companySysId: string, jobExecutorConfigurationSysId: string): ICmdbAmpJobExecutor;
    }

    export interface ICmdbAmpAgentHelper extends avanade.ampcmdb.ICmdbAmpAgentHelper {
        new(): ICmdbAmpAgentHelper;
    }

    export interface ICmdbAmpAgentReplicator extends avanade.ampcmdb.ICmdbAmpAgentReplicator {
        new(): ICmdbAmpAgentReplicator;
    }

    export type AgentSoftwareNameType = 'Amp.JobExecutor.Agent' | 'Amp.Monitoring.Agent' | 'Amp.Rdp.Server';
    export type AgentSoftwareCiClassType = 'x_avana_cmdb_amp_job_agent' | 'x_avana_cmdb_amp_mon_agent' | 'x_avana_cmdb_amp_rdp_agent';
    export type AgentSoftwareFileType = 'msi' | 'zip';

    interface IAmpJobExecutorServiceBusSettings {
        resourceGroupName: string;
        namespace: string;
        httpsEndpoint: string;
        sbEndpoint: string;
        location: string;
        snManageAuthorizationRule: IAmpJobExecutorServiceBusAuthorizationRule;
        snSendAuthorizationRule: IAmpJobExecutorServiceBusAuthorizationRule;
        snListenAuthorizationRule: IAmpJobExecutorServiceBusAuthorizationRule;
        jobRequestsTopicName: string;
        jobResponsesTopicName: string;
    }

    interface IAmpJobExecutorServiceBusAuthorizationRule {
        keyName: string;
        key: string;
    }

    interface IAmpJobExecutorAgentSettings {
        jobRequestTopicAgentSubscription: string;
        jobRequestSiteSubSASToken: string;
        jobRequestAgentSubSASToken: string;
        jobResponseTopicSASToken: string;
        heartbeatSASKey: string;
    }

    interface IAgentConfigurationContainer {
        installCommand: string;
        downloadUri: string;
        latestVersion: string;
        outParams?: x_avana_cmdb.IOutParams
    }

    export interface IOutParams {
        uri: string;
    }

    export type IConfigureSiteResult = {
        jobRequestsTopic: string;
        jobResponseTopic: string;
        jobRequestsSiteSubscription: string;
    }
}