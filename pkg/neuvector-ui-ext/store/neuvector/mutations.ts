import { StateConfig } from './index';
import _ from 'lodash';
import { NetworkRule } from 'types/network-rules';
import { NV_CONST } from '../../types/neuvector'

export default {
    updateHosts(state: StateConfig, hosts: any[]) {
        state.hosts = hosts;
    },
    updateWorkloads(state: StateConfig, workloads: any[]) {
        state.workloads = workloads;
    },
    updateRancherWorkloadMap(state: StateConfig, rancherWorkloadMap: Map<string, string>) {
        state.rancherWorkloadMap = rancherWorkloadMap;
    },
    updateScannedWorkloadMap(state: StateConfig, entry: {workloadID: string, scannedResult: Object}) {
        state.scannedWorkloadMap.set(entry.workloadID, entry.scannedResult);
    },
    updateScannedNodeMap(state: StateConfig, entry: {nodeID: string, scannedResult: Object}) {
        state.scannedNodeMap.set(entry.nodeID, entry.scannedResult);
    },
    updateIsNetworkRuleChanged(state: StateConfig, isNetworkRuleChanged: Boolean) {
        state.isNetworkRuleChanged = isNetworkRuleChanged;
    },
    updateNetworkRules(state: StateConfig, networkRules: NetworkRule[]) {
        state.networkRules = networkRules;
    },
    insertNetworkRule(state: StateConfig, entry: {networkRule: NetworkRule, targetIndex: number}) {
        state.networkRules.splice(entry.targetIndex, 0, entry.networkRule);
    },
    removeNetworkRule(state: StateConfig, entry: {networkRule: NetworkRule, targetIndex: number}) {
        console.log(entry.targetIndex)
        state.networkRules.splice(entry.targetIndex, 1);
    },
    updateIsNetworkRuleListDirty(state: StateConfig, isNetworkRuleListDirty: Boolean) {
        state.isNetworkRuleListDirty = isNetworkRuleListDirty;
    },
    updateNetworkRulesBackup(state: StateConfig, networkRules: NetworkRule[]) {
        state.networkRulesBackup = _.cloneDeep(networkRules);
    },
    increaseNewId(state: StateConfig) {
        state.newId ++;
    },
    initializeNewId(state: StateConfig) {
        state.newId = NV_CONST.NEW_ID_SEED.NETWORK_RULE;
    },
}