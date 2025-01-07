<script>
    import QuickFilter from './quickFilter/QuickFilter';
    import AdvancedFilter from './buttons/AdvancedFilter.vue';
    import { getSecEvents } from '../../plugins/security-events-class';
    import { combineSecurityEvents } from '../../utils/security-events';
    import { SERVICE } from '@shell/config/types';
    import { nvVariables, NV_CONST, RANCHER_CONST } from '../../types/neuvector';
    import { refreshAuth } from '../../plugins/neuvector-class'; 
    import TimeSparklingChart from './timeSlider/TimeSparklingChart';
    import TimeSlider from './timeSlider/TimeSlider';
    import { prepareContext4TwoWayInfinityScroll, filterSecEvents } from '../../utils/security-events';
    import { vTooltip } from 'floating-vue';
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
    import BriefInfo from './contents/BriefInfo';
    import Details from './contents/Details';
    import Packet from './dialogs/Packet';
    import NodeInfo from '../common/dialogs/NodeInfo';
    import PodInfo from '../common/dialogs/PodInfo';
    import EnforcerInfo from '../common/dialogs/EnforcerInfo';
    import DownloadCsv from  './buttons/DownloadCsv';
    import Refresh from '../common/buttons/Refresh';
    import Loading from '@shell/components/Loading';
    import PrintableReport from './reports/PrintableReport.vue';
    import html2pdf from 'html2pdf.js';

    // library.add(faSomeIcon);

    export default {
        components: {
            QuickFilter,
            TimeSparklingChart,
            TimeSlider,
            FontAwesomeIcon,
            BriefInfo,
            Details,
            AdvancedFilter,
            Packet,
            NodeInfo,
            PodInfo,
            EnforcerInfo,
            DownloadCsv,
            Refresh,
            Loading,
            PrintableReport
        },
        async fetch() {
            if ( this.$store.getters['cluster/canList'](SERVICE) ) {
                this.allServices = await this.$store.dispatch('cluster/findAll', { type: SERVICE }, { root: true });
                if ( Array.isArray(this.allServices) && this.allServices.length ) {
                    nvVariables.ns = this.allServices.find(svc => svc?.id?.includes(NV_CONST.NV_SERVICE)).metadata.namespace
                }
            }
            this.currentCluster = this.$store.getters['currentCluster'];
            nvVariables.currentCluster = this.currentCluster.id;
            await this.loadData();
        },
        data() {
            return {
                secEvents: null,
                processedSecEvents: {
                    cachedSecurityEvents: null,
                    displayedSecurityEvents: null,
                    domainList: null,
                    autoCompleteData: null,
                },
                securityEventsDataCtx: null,
                showPacketModal: null,
                packet: null,
                showHostInfoModal: null,
                host: null,
                showWorkloadInfoModal: null,
                workload: null,
                showEnforcerInfoModal: null,
                enforcer: null,
                showAdvFilterModal: null,
                isPrintable: false
            };
        },
        props: {
            mode: { type: String, default: 'edit' }
        },
        methods: {
            loadData: async function() {
                try {
                    console.log('Security Events');
                    this.authRes = await refreshAuth();
                    nvVariables.user = this.authRes.data.token;
                    this.secEvents = await getSecEvents();
                    this.processedSecEvents = await combineSecurityEvents(this.secEvents, this.$store);
                    console.log('processedSecEvents:', this.processedSecEvents);
                    this.securityEventsDataCtx = nvVariables.dateSliderCtx;
                    prepareContext4TwoWayInfinityScroll(this.securityEventsDataCtx);
                    console.log('this.securityEventsDataCtx', this.securityEventsDataCtx)
                    this.showPacketModal = nvVariables.showPacketModal;
                    this.packet = nvVariables.packet;
                    this.showHostInfoModal = nvVariables.showHostInfoModal;
                    this.host = nvVariables.host;
                    this.showWorkloadInfoModal = nvVariables.showWorkloadInfoModal;
                    this.workload = nvVariables.workload;
                    this.showEnforcerInfoModal = nvVariables.showEnforcerInfoModal;
                    this.enforcer = nvVariables.enforcer;
                    this.showAdvFilterModal = nvVariables.showAdvFilterModal;
                    filterSecEvents();
                } catch(error) {
                    console.error(error);
                }
            },
            getOpenedRec: function(evt, index, page) {
                if (evt.target.checked) {
                    this.securityEventsDataCtx.openedIndex = index;
                    this.securityEventsDataCtx.openedPage = page;
                } else {
                    this.securityEventsDataCtx.openedIndex = -1;
                    this.securityEventsDataCtx.openedPage = -1;
                }
            },
            closeDetails: function(elemId) {
                console.log(elemId)
                document.getElementById(elemId)['checked'] = false;
                this.securityEventsDataCtx.openedIndex = -1;
                this.securityEventsDataCtx.openedPage = -1;
            },
            isTooltipDisabled: function(e) {
                console.log('e', e)
                return e[0].scrollWidth <= e[0].clientWidth;
            },
            closePacketModal: function() {
                this.showPacketModal.value = false;
            },
            closeHostInfoModal: function() {
                this.showHostInfoModal.value = false;
            },
            closeWorkloadInfoModal: function() {
                this.showWorkloadInfoModal.value = false;
            },
            closeEnforcerInfoModal: function() {
                this.showEnforcerInfoModal.value = false;
            },
            closeAdvFilterModal: function() {
                this.showAdvFilterModal.value = false;
            },
            exportPdf: function() {
                this.isPrintable = true; // Ensure printable content is visible
                this.$nextTick(() => {
                    const element = document.querySelector('.printable-area'); // Target printable area
                    
                    console.log('Printable Area Content:', element.innerHTML);
                    const options = {
                        margin: .4,
                        filename: 'Security_Events_Report.pdf',
                        image: { type: 'jpeg', quality: 0.98 },
                        html2canvas: { scale: 2 },
                        jsPDF: { unit: 'in', format: 'A4', orientation: 'landscape' }
                    };

                    // Generate the PDF and open it in a new tab
                    html2pdf().set(options).from(element).outputPdf('datauristring').then((pdfDataUri) => {
                        const pdfWindow = window.open(); // Open a new tab
                        pdfWindow.document.write(`<iframe width="100%" height="100%" src="${pdfDataUri}"></iframe>`); // Embed the PDF
                        this.isPrintable = false; // Reset printable state
                    }).catch(error => {
                        console.error('Error generating PDF preview:', error);
                        this.isPrintable = false;
                    });
                });
            }
        },
        computed: {
            isLightTheme: function() {
                nvVariables.isLightTheme = sessionStorage.getItem(RANCHER_CONST.R_THEME) !== RANCHER_CONST.THEME.DARK;
                return nvVariables.isLightTheme;
            }
        },
        directives: {
            'two-way-infinite-scroll': {
                bind: function(el, binding, vnode) {
                    console.log('binding.arg',binding.value, el, vnode);
                    el.addEventListener('scroll', () => {
                        scroll();
                    });
                    const scroll = () => {
                        console.log('scrolling...')
                        let a =el.scrollTop;
                        let b =el.scrollHeight - el.clientHeight;

                        let percentOfScroll = a / b;

                        if (percentOfScroll > 0.9) {
                        if (binding.value.array.length - binding.value.begin > binding.value.limit) {
                            binding.value.begin += 9;
                            binding.value.page++;
                            console.log('page: ', binding.value.page)
                            el.scrollTop -= 650;
                            closeDetails();
                        }
                        } else if (percentOfScroll < 0.2 && percentOfScroll > 0) {
                        if (binding.value.begin !== 0) {
                            // console.log('binding.value.begin - 1');
                            binding.value.begin -= 9;
                            binding.value.page--;
                            console.log('page: ', binding.value.page)
                            el.scrollTop += 650;
                            closeDetails();
                        }
                        } else if (percentOfScroll == 0) {
                            binding.value.begin = 0;
                        }
                        let targetIndex =
                            binding.value.openedIndex - 9 * (binding.value.page - binding.value.openedPage);
                        if (targetIndex < 30 && targetIndex >= 0) {
                            document.getElementById(`sec-${targetIndex}`)['checked'] = true;
                        }
                    };
                    
                    const closeDetails = () => {
                        document.getElementsByName('secEvt').forEach((elem) => {
                            elem.checked = false;
                        });
                    };
                }
            },
            'tooltip': vTooltip
        }
    };
</script>

<template>
    <Loading v-if="$fetchState.pending" />
    <div v-else-if="isPrintable" class="printable-area">
            <PrintableReport />
        </div>
    <div v-else class="screen-area">
        <div id="sec-event" class="padding-top-0">
            <header style="margin-bottom: 10px;" id="security-events-title">
                <div class="title">
                    <h1 class="m-0">{{ t('sidebar.nav.SECURITY_EVENT') }}</h1>
                </div>
                <div class="actions-container">
                    <div class="pull-right" style="margin-left: 8px;">
                        <Refresh :reloadData="loadData"/>
                    </div>
                    <button
                        mat-button
                        class="btn role-secondary"
                        aria-label="Export secutiry events reports CSV"
                        type="button"
                        @click="exportPdf()">
                        PDF
                    </button>
                    <div class="pull-right"
                        v-if="processedSecEvents.cachedSecurityEvents && processedSecEvents.cachedSecurityEvents.length > 0">
                        <DownloadCsv />
                    </div>
                    <div v-if="processedSecEvents.cachedSecurityEvents && processedSecEvents.cachedSecurityEvents.length > 0" class="pull-right" style="margin-right: 10px;">
                        <AdvancedFilter 
                            :isLightTheme="isLightTheme"
                            :autoCompleteData="processedSecEvents.autoCompleteData" 
                        />
                    </div>
                    <div class="pull-right"  style="margin-right: 20px;">
                        <QuickFilter />
                    </div>
                </div>
            </header>
            <div v-if="processedSecEvents.cachedSecurityEvents && processedSecEvents.cachedSecurityEvents.length > 0">
                <span v-if="processedSecEvents.displayedSecurityEvents.length === processedSecEvents.cachedSecurityEvents.length">{{ t('enum.OUT_OF') }}</span>
                <span v-if="processedSecEvents.displayedSecurityEvents.length < processedSecEvents.cachedSecurityEvents.length">{{ t('enum.FOUND') }}</span>
                <span>{{ processedSecEvents.displayedSecurityEvents.length }}</span><span v-if="processedSecEvents.displayedSecurityEvents.length < processedSecEvents.cachedSecurityEvents.length"> / <span>{{ processedSecEvents.cachedSecurityEvents.length }}</span></span>
            </div>
            <div style="height: 95px; position: relative" class="mt-2" v-if="processedSecEvents.cachedSecurityEvents && processedSecEvents.cachedSecurityEvents.length > 0">
                <TimeSparklingChart
                    v-if="processedSecEvents.cachedSecurityEvents"
                    :securityEventsList="processedSecEvents.cachedSecurityEvents"
                />
                <TimeSlider
                    :securityEventsList="processedSecEvents.cachedSecurityEvents"
                />
            </div>
        </div>
        <div id="sec-event-list"
            v-if="
                    processedSecEvents.cachedSecurityEvents && processedSecEvents.cachedSecurityEvents.length > 0
                "
            :class="'timeline-nv' + (isLightTheme ? '' : '-dark') + ' normal'"
            style="margin-top: 12px"
            v-two-way-infinite-scroll:ctx="securityEventsDataCtx"
        >
            <ul id="timeline">
                <li
                    class="sec-event-row"
                    :id="'sec-wrap-' + index "
                    v-for="
                        (secEvent, index) in processedSecEvents.displayedSecurityEvents
                        .slice(securityEventsDataCtx.begin, securityEventsDataCtx.begin + securityEventsDataCtx.limit)
                    "
                    :key="index"
                >
                    <input
                        class="radio"
                        :id="'sec-' + index "
                        name="secEvt"
                        type="radio"
                        @click="
                            getOpenedRec(
                                $event,
                                index,
                                securityEventsDataCtx.page
                            )
                        " />
                    <div class="relative">
                        <label :for="'sec-' + index">
                            <div class="heading">
                                <BriefInfo :secEvent="secEvent" :index="index"/>
                            </div>
                        </label>
                        <span class="date">{{ secEvent.relativeDate }}</span>
                        <span class="circle"></span>
                    </div>
                    <div class="sec-event-content">
                        <button
                            id="detail-close"
                            class="btn-link pull-right sec-fixed-close"
                            @click="closeDetails('sec-' + index)">
                            <em class="icon-close"></em>
                        </button>
                        <Details :secEvent="secEvent"/>
                    </div>
                </li>
            </ul>
            <Packet v-if="showPacketModal && showPacketModal.value" :packet="packet.value" @close="closePacketModal"></Packet>
            <NodeInfo v-if="showHostInfoModal && showHostInfoModal.value" :host="host.value" @close="closeHostInfoModal"></NodeInfo>
            <PodInfo v-if="showWorkloadInfoModal && showWorkloadInfoModal.value" :workload="workload.value" @close="closeWorkloadInfoModal"></PodInfo>
            <EnforcerInfo v-if="showEnforcerInfoModal && showEnforcerInfoModal.value" :enforcer="enforcer.value" @close="closeEnforcerInfoModal"></EnforcerInfo>
        </div>
        <div v-else class="text-center mt-5">
            {{ t('general.NO_ROWS') }}
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import '../../styles/security-events.scss';
    @import '../../styles/neuvector.scss';
    @import '../../styles/print.scss';

</style>