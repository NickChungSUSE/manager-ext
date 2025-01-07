<script>
    import { Bar } from 'vue-chartjs/legacy';

    export default {
        props: {
            chartId: {
                type: String,
                default: 'security-events-printable-report-bar-chart'
            },
            securityEvents: {
                type: Array,
                default: []
            }
        },
        components: {
            Bar
        },
        computed: {
            chartData: function() {
                const TYPE_BAR_COLORS = ["#E91E63", "#EF5350", "#FF9800", "#29B6F6"];
                const TYPE_BAR_LABELS = [
                    'Error',
                    'Critical',
                    'Warning',
                    'Info'
                ];

                if (this.securityEvents.length === 0) {
                    this.isEmptyData = true;
                } else {
                    this.isEmptyData = false;
                    Array.from(this.securityEvents).forEach(secEvent => {
                        this.severityMap.set(secEvent.Severity, (this.severityMap.get(secEvent.Severity) || 0) + 1);
                    });
                    this.severityEntries = Array.from(this.severityMap.entries());
                    console.log("this.severityEntries", this.severityEntries);
                }

                let dataMap = {
                    'Error': this.severityMap.get('Error'),
                    'Critical': this.severityMap.get('Critical'),
                    'Warning': this.severityMap.get('Warning'),
                    'Info': this.severityMap.get('Info')
                };

                return {
                    labels: TYPE_BAR_LABELS,
                    datasets: [
                        {
                            axis: 'y',
                            label: 'Security Events by Type',
                            data: Array.from(Object.values(dataMap)),
                            fill: false,
                            backgroundColor: TYPE_BAR_COLORS,
                            borderColor: TYPE_BAR_COLORS,
                            hoverBackgroundColor: TYPE_BAR_COLORS,
                            hoverBorderColor: TYPE_BAR_COLORS,
                            barThickness: 15,
                            borderWidth: 2
                        }
                    ],
                };
            }
        },
        data() {
            return {
                severityMap: new Map(),
                severityEntries: [],
                barChartConfig: {},
                processedSecurityEvents: [],
                chartOptions: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false
                },
                isEmptyData: false,
                colourMap: {
                    'security-event': 'threat',
                    Debug: 'inverse',
                    Info: 'info',
                    Notice: 'idle',
                    Warning: 'warning',
                    error: 'pink',
                    Error: 'pink',
                    ERROR: 'pink',
                    Critical: 'danger',
                    critical: 'danger',
                    Alert: 'pink',
                    Emergency: 'danger',
                    Low: 'success',
                    Medium: 'warning',
                    High: 'danger',
                    HIGH: 'danger',
                    Moderate: 'warning',
                    Important: 'danger',
                    disconnected: 'warning',
                    discover: 'discover',
                    protect: 'protect',
                    unmanaged: 'warning',
                    monitor: 'monitor',
                    quarantined: 'pink',
                    connected: 'success',
                    stopped: 'inverse',
                    Discover: 'discover',
                    Monitor: 'monitor',
                    Protect: 'protect',
                    allow: 'allow',
                    exception: 'success',
                    deny: 'deny',
                    alert: 'warning',
                    block_access: 'deny',
                    monitor_change: 'info',
                    LEARNED: 'learn-rule',
                    CUSTOM: 'customer-rule',
                    GROUND: 'ground-rule',
                    FED: 'fed-rule',
                    USER_CREATED: 'customer-rule',
                    FEDERAL: 'fed-rule',
                    SYSTEM_DEFINED: 'predefined',
                    learned: 'learn-rule',
                    user_created: 'customer-rule',
                    'new-rule': 'new-rule',
                    'modified-rule': 'modified-rule',
                    'disabled-rule': 'disabled-rule',
                    ground: 'ground-rule',
                    'removed-rule': 'removed-rule',
                    federal: 'fed-rule',
                    'readonly-rule': 'readonly-rule',
                    'moved-rule': 'moved-rule',
                    modify: 'modify-permission',
                    view: 'view-permission',
                    finished: 'info',
                    idle: 'idle',
                    scanning: 'primary',
                    running: 'primary',
                    scheduled: 'inverse',
                    failed: 'danger',
                    unsupported: 'warning',
                    NOTE: 'note',
                    PASS: 'success',
                    WARN: 'warning',
                    INFO: 'info',
                    violate: 'warning',
                    threat: 'threat',
                    violation: 'violation',
                    incident: 'incident',
                    event: 'event',
                    'cve-report': 'cve-report',
                    compliance: 'benchmark',
                    quarantine: 'quarantine',
                    webhook: 'webhook',
                    'suppress-log': 'suppress-log',
                    disabled_background: 'disabled-action',
                    disabled_color: 'disabled-action-2',
                    err: 'danger',
                    block: 'danger',
                    'admission-control': 'admission-control',
                    mc_active: 'info',
                    mc_pinging: 'idle',
                    mc_unknown_cmd: 'idle',
                    mc_notified: 'info',
                    mc_req_error: 'warning',
                    mc_master_upgrade_required: 'warning',
                    mc_joint_upgrade_required: 'warning',
                    mc_cluster_upgrade_ongoing: 'warning',
                    mc_joint_version_too_new: 'warning',
                    mc_connected: 'success',
                    mc_disconnected: 'danger',
                    mc_joined: 'joined',
                    mc_pending: 'warning',
                    mc_out_of_sync: 'danger-tran',
                    mc_synced: 'success',
                    mc_syncing: 'idle',
                    mc_kicked: 'danger',
                    mc_left: 'danger',
                    mc_license_disallow: 'danger',
                    comment: 'idle',
                    url: 'info',
                    response: 'success',
                    images: 'idle',
                    MANUAL:'info',
                }
            };
        },
        created() {
            this.processedSecurityEvents = this.securityEvents.map(secEvent => {
                secEvent.Details.replace(/\\n/g, '<br/>');
                return secEvent;
            });
           
        },
    }
</script>

<template>
    <div>
        <div class="page-cover">
            <div class="page-cover-decro"></div>
            <div class="page-cover-logo"></div>
            <div class="page-cover-title">Security Events Report</div>
        </div>
        <div class="report-summary pagebreak">
            <div class="summary-title">
                {{ this.t('policy.report.SUMMARY_HEADER') }}
            </div>
            <div class="clearfix">
                <div class="margin-left-l" style="width: 50%">
                    <div class="summary-subtitle margin-top-m margin-bottom-m">
                        {{ this.t('policy.report.BY_TYPE') }}
                    </div>
                    <div class="row statistic-row" v-for="(entry, _) in severityEntries">
                        <div class="col-sm-9 statistic-cell">
                        {{ entry[0] }}
                        </div>
                        <div class="col-sm-3 statistic-cell">
                        {{ entry[1] }}
                        </div>
                    </div>
                </div>
                <div class="margin-left-l margin-top-xxxl margin-right-xl">
                    <Bar
                        v-if="!isEmptyData"
                        :chart-id="chartId"
                        :chart-data="chartData"
                        :chart-options="chartOptions"
                    />
                </div>
            </div>
        </div>
        <div class="report-summary pagebreak">
            <div class="summary-title">
                {{ this.t('scan.report.others.DETAILS') }}
            </div>
            <table class="print-table margin-top-l margin-left-l">
                <thead>
                    <tr class="print-header">
                        <th class="print-cell" style="width: 5%">
                            {{ this.t('securityEvent.pdf.ID') }}
                        </th>
                        <th class="print-cell" style="width: 18%">
                            {{ this.t('securityEvent.pdf.TITLE') }}
                        </th>
                        <th class="print-cell" style="width: 7%">
                            {{ this.t('securityEvent.pdf.SEVERITY') }}
                        </th>
                        <th class="print-cell" style="width: 20%">
                            {{ this.t('securityEvent.pdf.LOCATION') }}
                        </th>
                        <th class="print-cell" style="width: 35%">
                            {{ this.t('securityEvent.pdf.DETAILS') }}
                        </th>
                        <th class="print-cell" style="width: 7%">
                            {{ this.t('securityEvent.pdf.ACTION') }}
                        </th>
                        <th class="print-cell" style="width: 8%">
                            {{ this.t('securityEvent.pdf.DATETIME') }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="print-row" v-for="(securityEvent, i) in securityEvents" :key="i" :data-index="i">
                        <td class="print-cell" style="width: 5%">
                            {{ securityEvent.ID }}
                        </td>
                        <td class="print-cell" style="width: 18%">
                            {{ securityEvent.Title }}
                        </td>
                        <td class="print-cell" style="width: 7%">
                            <div
                                v-if="colourMap[securityEvent.Severity]"
                                :class="['action-label', 'px-1', colourMap[securityEvent.Severity]]"
                            >
                                {{ securityEvent.Severity }}
                            </div>
                        </td>
                        <td class="print-cell" style="width: 20%">
                            <div v-for="(location, _) in securityEvent.Location.split('<br/>')">
                                {{ location }}
                            </div>
                        </td>
                        <td class="print-cell" style="width: 35%">
                            <div v-for="(detail, _) in securityEvent.Details.split('<br/>')">
                                {{ detail }}
                            </div>
                        </td>
                        <td class="print-cell" style="width: 7%">
                            <div
                                v-if="colourMap[securityEvent.Action.toLowerCase()]"
                                :class="['action-label', 'px-1', colourMap[securityEvent.Action.toLowerCase()]]"
                            >
                                {{ securityEvent.Action }}
                            </div>
                        </td>
                        <td class="print-cell" style="width: 8%">
                            {{ securityEvent.Datetime }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import '../../../styles/print.scss';
</style>