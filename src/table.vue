<template>
    <div :class="wrapClasses" :style="wrapStyle" ref="tableWrap">
        <!-- <table-loading-bar v-bind="$props" :headHeight="headHeight" /> -->
        <!-- /table-loading-bar -->
        <div
            :class="[
                'flex-table-layout',
                isScrollLeft ? 'flex-table-scroll-left' : '',
            ]"
            ref="flexTableLayout"
            @scroll="onScroll"
            @mousewheel="handleMousewheel"
            @DOMMouseScroll="handleMousewheel"
        >
            <div class="flex-table" :style="style">
                <table-head
                    v-bind="$props"
                    ref="tableHeader"
                    :cal-width="calWidth"
                    :columns="tableColumns"
                    :data="dataList"
                    :allData="prefixData"
                    :resizable="resizable"
                    @getheadHeight="getheadHeight"
                    @on-select-all="selectAll"
                    @on-sort-change="onSortChange"
                    @on-col-resize="onColResizeStart"
                    :style="fixedHead ? 'visibility: hidden;' : ''"
                >
                    <template #batchCheck>
                        <slot name="batchCheck" />
                    </template>
                </table-head>
                <!-- /flex-table-head -->

                <table-sum
                    v-if="headSum"
                    ref="tableSum"
                    :cal-width="calWidth"
                    :columns="tableColumns"
                    :headSum="headSum"
                ></table-sum>
                <!-- /flex-table-headSum -->

                <table-body
                    v-bind="$props"
                    ref="tableBody"
                    :cal-width="calWidth"
                    :columns="tableColumns"
                    :data="dataList"
                    :maxHeight="maxHeight"
                    :rowHeight="rowHeight"
                    :no-data="noData"
                    :scrollTop="scrollTop"
                    :hoverIndex="hoverIndex"
                    :selectedClass="selectedClass"
                    :spanMethod="spanMethod"
                    :scrollerStyle="scrollerStyle"
                    @scroll.native.passive="syncScroll"
                    @on-toggle-select="toggleSelect"
                    @on-row-click="handleRowClick"
                    @doLayout="doLayout"
                ></table-body>
                <!-- /flex-table-body -->

                <table-foot
                    v-if="sum"
                    ref="tableFoot"
                    :cal-width="calWidth"
                    :columns="tableColumns"
                    :sum="sum"
                ></table-foot>
                <!-- /flex-table-foot -->
            </div>

            <div
                :class="[
                    'flex-table-fixed-left',
                    bodyIsScroll > 0 ? 'is-scroll' : '',
                ]"
                v-if="hasFixedLeft"
                :style="{ width: fixedLeftWidth + 'px' }"
            >
                <table-head
                    v-bind="$props"
                    ref="tableHeader"
                    :cal-width="calWidth"
                    :columns="tableColumns"
                    onlyFixed="left"
                    :data="dataList"
                    :allData="data"
                    :resizable="resizable"
                    :rowHeight="rowHeight.header"
                    :is-render-done="isRenderDone"
                    @getheadHeight="getheadHeight"
                    @on-select-all="selectAll"
                    @on-sort-change="onSortChange"
                    @on-col-resize="onColResizeStart"
                >
                    <template #batchCheck>
                        <slot name="batchCheck" />
                    </template>
                </table-head>

                <table-sum
                    v-if="headSum"
                    ref="tableSum"
                    :cal-width="calWidth"
                    :columns="tableColumns"
                    :headSum="headSum"
                ></table-sum>
                <!-- /flex-table-headSum -->

                <table-body
                    v-bind="$props"
                    ref="tableBody"
                    onlyFixed="left"
                    :cal-width="calWidth"
                    :columns="tableColumns"
                    :data="dataList"
                    :maxHeight="maxHeight"
                    :rowHeight="rowHeight"
                    :scrollTop="scrollTop"
                    :hoverIndex="hoverIndex"
                    :selectedClass="selectedClass"
                    :spanMethod="spanMethod"
                    @on-toggle-select="toggleSelect"
                    @on-row-click="handleRowClick"
                    @doLayout="doLayout"
                ></table-body>

                <table-foot
                    v-if="sum"
                    onlyFixed="left"
                    :cal-width="calWidth"
                    :columns="tableColumns"
                    :sum="sum"
                    :rowHeight="rowHeight.footer"
                ></table-foot>
            </div>

            <div
                :class="['flex-table-fixed-right-wrap']"
                v-if="hasFixedRight"
                :style="{ width: fixedRightWidth + 'px' }"
            >
                <div class="flex-table-fixed-right">
                    <table-head
                        v-bind="$props"
                        ref="tableHeader"
                        :cal-width="calWidth"
                        :columns="tableColumns"
                        onlyFixed="right"
                        :data="dataList"
                        :allData="data"
                        :resizable="resizable"
                        :rowHeight="rowHeight.header"
                        :is-render-done="isRenderDone"
                        @on-select-all="selectAll"
                        @on-sort-change="onSortChange"
                        @on-col-resize="onColResizeStart"
                    >
                        <template #batchCheck>
                            <slot name="batchCheck" />
                        </template>
                    </table-head>

                    <table-sum
                        v-if="headSum"
                        ref="tableSum"
                        :cal-width="calWidth"
                        :columns="tableColumns"
                        :headSum="headSum"
                    ></table-sum>
                    <!-- /flex-table-headSum -->

                    <table-body
                        v-bind="$props"
                        ref="fixedRightBody"
                        onlyFixed="right"
                        :cal-width="calWidth"
                        :columns="tableColumns"
                        :data="dataList"
                        :maxHeight="maxHeight"
                        :rowHeight="rowHeight"
                        :scrollTop="scrollTop"
                        :hoverIndex="hoverIndex"
                        :selectedClass="selectedClass"
                        :spanMethod="spanMethod"
                        @on-toggle-select="toggleSelect"
                        @on-row-click="handleRowClick"
                        @doLayout="doLayout"
                    ></table-body>

                    <table-foot
                        v-if="sum"
                        onlyFixed="right"
                        :cal-width="calWidth"
                        :columns="tableColumns"
                        :sum="sum"
                        :rowHeight="rowHeight.footer"
                    ></table-foot>
                </div>
            </div>

            <div
                class="flex-table-reference-line"
                :class="{ cur: colResize.currentX !== 0 }"
                :style="{ left: `${colResize.currentX}px` }"
            ></div>
            <slot name="loading" v-if="loading">
                <Spinner fix size="large"></Spinner>
            </slot>
            <div
                class="flex-table-fixed-scroll"
                v-if="fixedXScroll"
                ref="fixedXScroll"
                @scroll="onScroll"
            >
                <div class="flex-table-fixed-scroll-content"></div>
            </div>
        </div>
        <div
            :class="getFixedHeadClass"
            :style="fixedHeadStyle"
            v-if="fixedHead"
        >
            <div
                class="flex-table-head-fixed"
                ref="flexTableFixedHead"
                @mousewheel="handleMousewheel"
                @DOMMouseScroll="handleMousewheel"
            >
                <div class="flex-table" :style="style">
                    <table-head
                        v-bind="$props"
                        ref="tableHeader"
                        :cal-width="calWidth"
                        :columns="tableColumns"
                        :data="dataList"
                        :resizable="resizable"
                        @on-select-all="selectAll"
                        @on-sort-change="onSortChange"
                        @on-col-resize="onColResizeStart"
                    >
                        <template #batchCheck>
                            <slot name="batchCheck" />
                        </template>
                    </table-head>
                    <!-- /flex-table-head -->
                </div>
                <div
                    :class="[
                        'flex-table-fixed-left',
                        bodyIsScroll > 0 ? 'is-scroll' : '',
                    ]"
                    v-if="hasFixedLeft"
                    :style="{ width: fixedLeftWidth + 'px' }"
                >
                    <table-head
                        v-bind="$props"
                        ref="tableHeader"
                        :cal-width="calWidth"
                        :columns="tableColumns"
                        onlyFixed="left"
                        :data="dataList"
                        :resizable="resizable"
                        :rowHeight="rowHeight.header"
                        :is-render-done="isRenderDone"
                        @on-select-all="selectAll"
                        @on-sort-change="onSortChange"
                        @on-col-resize="onColResizeStart"
                    >
                        <template #batchCheck>
                            <slot name="batchCheck" />
                        </template>
                    </table-head>
                </div>
            </div>
        </div>
        <!-- /flex-table-fixed-head -->
        <tableScrollBar
            v-if="showScrollBar"
            :body-h="bodyH"
            :header-h="headerH"
            :max-height="maxHeight"
            :scroll="handleScrollYScroll"
            :sum="!!sum"
            :scrollTop="scrollTop"
            ref="scrollYBody"
            @mouseenter.native="scrollBarOver"
            @mouseleave.native="scrollBarLeave"
        ></tableScrollBar>
        <!-- /Y轴固定滚动条 -->
    </div>
</template>
<style lang="less">
@import url('./css/main.less');
</style>

<script>
import tableHead from './tableHead.vue';
import tableBody from './tableBody.vue';
import tableFoot from './tableFoot.vue';
import tableSum from './tableSum.vue';
import tableLoadingBar from './tableLoadingBar.vue';
import tableScrollBar from './tableScrollBar.vue';
import Spinner from './Spinner.vue';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import normalizeWheel from 'normalize-wheel';

import { MIN_WIDTH } from './data';

const prefixCls = 'flex-table';

let tableIdSeed = 1;
export default {
    name: 'flexTable',
    components: {
        tableHead,
        tableBody,
        tableFoot,
        tableScrollBar,
        Spinner,
        tableSum,
        tableLoadingBar,
    },
    props: {
        data: {
            type: Array,
            default() {
                return [];
            },
        },
        sum: {
            type: [Object, Boolean],
        },
        headSum: {
            type: [Object, Boolean],
        },
        uniqueKey: {
            type: String,
            default: 'id',
        },
        columns: {
            type: Array,
            default() {
                return [];
            },
        },
        loading: {
            type: Boolean,
            default: false,
        },
        height: {
            type: Number,
        },
        resizable: {
            type: Boolean,
            default: false,
        },
        noData: {
            type: String,
            default: 'No Data',
        },
        size: {
            type: String,
            default: 'default',
        },
        theme: {
            type: String,
            default: 'light',
        },
        border: {
            type: Boolean,
            default: true,
        },
        stripe: {
            type: Boolean,
            default: true,
        },
        asyncRender: {
            type: Number,
            default: 0,
        },
        minWidth: {
            type: Number,
            default: MIN_WIDTH,
        },
        maxWidth: {
            type: Number,
        },
        fixedHead: {
            type: Boolean,
            default: false,
        },
        fixedHeadTop: {
            type: Number,
            default: 0,
        },
        // 自定义的head fixed判断方法
        checkFixedHeadTop: {
            type: Function,
        },
        selectedClass: {
            type: String,
            default: '',
        },
        rowClassName: {
            type: Function,
            default: () => {
                return '';
            },
        },
        spanMethod: {
            type: Function,
        },
        multiple: {
            type: Boolean,
            default: true,
        },
        selectedData: {
            type: Array,
            default() {
                return [];
            },
        },
        /**
         * 是否自动计算，当全部的column设置width时，加起来的宽度没有达到外层table的宽度
         * 这个时候会剩余的宽度平均添加每个column
         */
        autoCalWidth: {
            type: Boolean,
            default: true,
        },
        /**
         * virtualScroll 开启虚拟滚动，并设置数据条数
         * virtualHeight 虚拟滚动时每一条数据的高度
         */
        virtualScroll: {
            type: Number,
        },
        virtualHeight: {
            type: Number,
            default: 40,
        },
        enableRowCheck: {
            type: Boolean,
            default: false,
        },
        scrollContainer: {
            type: [String, Object],
        },
        fixedXScroll: {
            type: Boolean,
            default: false,
        },
        fixedXScrollBottom: {
            type: [String, Number],
            default: 0,
        },
        vertical: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            tableId: tableIdSeed++,
            rowHeight: { header: 0, footer: 0 },
            dataList: [],
            style: {},
            wrapStyle: {},
            calWidth: {},
            tableColumns: [],
            headerH: 38,
            maxHeight: 0,
            bodyH: 0,
            footH: 54,
            scrollTop: 0,
            scrollLeft: 0,
            bodyIsScroll: 0,
            shouldEachRenderQueue: false,
            hasFixedLeft: false,
            hasFixedRight: false,
            scrollYScrolling: false,
            hoverIndex: undefined,
            isRenderDone: true,
            fixedHeadStyle: { 'overflow-x': 'hidden' },
            isFixedHead: false,
            colResize: {
                onColResizing: false,
                originX: 0, // 记录拖动起点
                currentX: 0, // 拖动实时位置
                resizeIndex: -1, // 调整的表头 index
                minX: 0, // 可拖动调整最小值
                maxX: Infinity, // 可拖动调整最大值
            },
            emitColResize: {
                newWidth: 0,
                oldWidth: 0,
                column: {},
                event: null,
            },
            // 虚拟滚动变量
            tableHeight: 0,
            startIndex: 0,
            prevStartIndex: -1,
            isSameDataRef: false,
            requestId: null,
            selected: [],
            prefixData: [],
            isSelectAll: false,
            headHeight: 0,
        };
    },
    computed: {
        wrapClasses() {
            let arr = [`${prefixCls}-wrap`];
            if (this.size === 'big') {
                arr.push(`${prefixCls}-big`);
            } else if (this.size === 'small') {
                arr.push(`${prefixCls}-small`);
            }
            if (this.theme === 'dark') {
                arr.push(`${prefixCls}-dark`);
            }
            if (this.showScrollBar) {
                arr.push('has-scroll-bar');
            }
            if (!this.border) {
                arr.push(`no-boder`);
            }
            if (!this.stripe) {
                arr.push(`no-stripe`);
            }
            return arr;
        },
        fixedLeftWidth: function () {
            return this.tableColumns.reduce((width, item) => {
                if (item.fixed === 'left') {
                    width += this.calWidth[item.key];
                }
                return width;
            }, 0);
        },
        fixedRightWidth: function () {
            return this.tableColumns.reduce((width, item) => {
                if (item.fixed === 'right') {
                    width += this.calWidth[item.key];
                }
                return width;
            }, 0);
        },
        showScrollBar: function () {
            if (this.isVirtualScroll) {
                return this.totalHeight > this.maxHeight;
            }
            return this.bodyH > this.height;
        },
        getFixedHeadClass: function () {
            let classNames = ['flex-table-head-fixed-layout'];
            if (this.isFixedHead) {
                classNames.push('is-fixed');
            }
            if (this.isScrollLeft) {
                classNames.push('flex-table-scroll-left');
            }
            return classNames;
        },
        // 虚拟滚动变量
        itemHeight() {
            return this.virtualHeight;
        },
        tableBody() {
            return this.$refs.tableBody;
        },
        totalSize() {
            return this.data.length;
        },
        poolSize() {
            return 1 + Math.ceil(this.maxHeight / this.itemHeight);
        },
        wrapperHeight() {
            if (!this.tableBody) {
                return 0;
            }
            return this.tableBody.$el.clientHeight;
        },
        maxIndex() {
            return this.totalSize - this.poolSize < 0
                ? 0
                : this.totalSize - this.poolSize;
        },
        totalHeight() {
            return this.totalSize * this.itemHeight;
        },
        scrollerStyle() {
            const { totalHeight } = this;
            return {
                position: 'relative',
                width: 'auto',
                height: totalHeight + 'px',
                maxHeight: totalHeight + 'px',
                overflow: 'hidden',
            };
        },
        // maxHeight() {
        //     return this.virtualScroll * this.itemHeight;
        // },
        isVirtualScroll() {
            return this.virtualScroll;
        },
        isScrollLeft() {
            return this.scrollLeft === 0;
        },
    },
    mounted() {
        if (this.isVirtualScroll) {
            this.maxHeight = this.virtualScroll * this.itemHeight;
        }

        this.doLayout();
        let observer = new ResizeObserver(() => {
            this.doLayout();
        });
        observer.observe(this.$el);
        this.resizeObserver = observer;
        window.addEventListener('scroll', this.winScroll, false);
        if (this.resizable) {
            window.addEventListener('mouseup', this.onColResizeEnd);
            this.$el.addEventListener('mousemove', this.onColResizeMove);
        }
        if (this.fixedXScroll) {
            this.$nextTick(() => {
                this.initFixedScrollListener();
            });
        }
    },
    watch: {
        selectedData: {
            handler(val) {
                if (val.length) {
                    this.initData();
                }
            },
            deep: true,
        },
        data: {
            handler: function (val) {
                if (this.isVirtualScroll) {
                    this.prefixData = val;
                    this.doLayout();
                    setTimeout(() => {
                        this.updateTable(true);
                    }, 0);
                    setTimeout(() => {
                        this.reSetItemHeight();
                    }, 100);
                } else {
                    this.doLayout();
                    this.initData();
                }
            },
            deep: true,
            immediate: true,
        },
        dataList: {
            handler(value) {
                if (this.isVirtualScroll) {
                    this.isSameDataRef = value === this.data;
                }
            },
            deep: true,
        },
        // height: function(val){
        //     this.calHeight();
        // },
        height: {
            handler(value) {
                this.calHeight();
            },
            deep: true,
        },
        columns: {
            handler: function (arr) {
                // sort cols
                const fixedLeftColumns = [];
                const fixedRightColumns = [];
                const ordinaryColumns = [];
                arr.forEach((col) => {
                    if (col.fixed === 'left') {
                        fixedLeftColumns.push(col);
                    } else if (col.fixed === 'right') {
                        fixedRightColumns.push(col);
                    } else {
                        ordinaryColumns.push(col);
                    }
                });
                this.tableColumns = [].concat(
                    fixedLeftColumns,
                    ordinaryColumns,
                    fixedRightColumns
                );
            },
            immediate: true,
        },
        tableColumns: {
            handler: function (arr) {
                this.doLayout();
                this.$nextTick(() => {
                    this.hasFixedLeft = this.computedFixedLeft();
                    this.hasFixedRight = this.computedFixedRight();
                });
                this.$emit('update:columns', arr);
            },
            deep: true,
            immediate: true,
        },
        sum: function () {
            this.calHeight();
        },
        headSum: function () {
            this.calHeight();
        },
        showScrollBar: function () {
            // if (this.isVirtualScroll) {
            //     return this.totalHeight > this.maxHeight;
            // }
            // return this.bodyH > this.maxHeight;
            this.resize();
        },
        scrollLeft(left) {
            this.$refs.flexTableLayout.scrollLeft = left;
            const flexTableFixedHead = this.$refs.flexTableFixedHead;
            if (flexTableFixedHead) {
                flexTableFixedHead.scrollLeft = left;
            }
            this.updateFixedScrollLeft(left);
        },
    },
    updated() {},
    beforeDestroy() {
        this.shouldEachRenderQueue = false;
        this._queueId = null;
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        window.removeEventListener('scroll', this.winScroll, false);
        window.removeEventListener('mouseup', this.onColResizeEnd);
        this.$el.removeEventListener('mousemove', this.onColResizeMove);
        if (this._scrollContainer) {
            this._scrollContainer.removeEventListener(
                'scroll',
                this.containerScrollFn
            );
        }
    },
    beforeCreate() {
        const self = this;
        this.doLayout = debounce(
            function () {
                self.resize();
                self.calHeight();
            },
            50,
            { leading: true }
        );
    },
    methods: {
        onScroll(event) {
            // 兼容拖动滚动条
            this.scrollLeft = event.target.scrollLeft;
        },
        syncScroll: throttle(function (event) {
            const { scrollTop } = event.target;
            this.scrollTop = scrollTop;
            if (this.isVirtualScroll) {
                // this.requestId = requestAnimationFrame(() => {
                this.$nextTick(() => {
                    this.requestId = this.updateTable();
                });
                // });
            }
        }, 0),
        updateHoverIndex: debounce(function (index) {
            this.hoverIndex = index;
        }, 100),
        handleMousewheel(event) {
            if (!this.$refs.tableBody) {
                return;
            }
            const normalized = normalizeWheel(event);
            if (Math.abs(normalized.spinY) > 0) {
                const bodyWrapper = this.$refs.tableBody.$el;
                const currentScrollTop = this.scrollTop;
                const noYetScrollToTop =
                    normalized.pixelY < 0 && currentScrollTop > 0;
                const noYetScrollToBottom =
                    normalized.pixelY > 0 &&
                    bodyWrapper.scrollHeight - bodyWrapper.clientHeight >
                        currentScrollTop;
                if (noYetScrollToTop || noYetScrollToBottom) {
                    event.preventDefault();
                    this.scrollTop += Math.ceil(normalized.pixelY);
                    this.scrollTop = Math.max(this.scrollTop, 0);
                }
            }
            if (Math.abs(normalized.spinX) > 0) {
                const bodyWrapper = this.$refs.tableBody.$el;
                const tableLayout = this.$refs.flexTableLayout;
                const currentScrollLeft = this.scrollLeft;
                const noYetScrollToLeft =
                    normalized.pixelX < 0 && currentScrollLeft > 0;
                const noYetScrollToRight =
                    normalized.pixelX > 0 &&
                    bodyWrapper.clientWidth - tableLayout.clientWidth >
                        currentScrollLeft;
                if (noYetScrollToLeft || noYetScrollToRight) {
                    event.preventDefault();
                    this.scrollLeft += Math.ceil(normalized.pixelX);
                    this.scrollLeft = Math.max(this.scrollLeft, 0);
                    this.$emit('on-scroll-x', event);
                }
            }
        },
        computedFixedLeft: function () {
            return this.tableColumns.some((item) => item.fixed === 'left');
        },
        computedFixedRight: function () {
            return this.tableColumns.some((item) => item.fixed === 'right');
        },
        initData() {
            this._queueId = new Date().getTime();
            this.rowHeight = { header: 0, footer: 0 };
            this.dataList = [];
            if (this.asyncRender > 0) {
                this.isRenderDone = false;
                this.data.slice(0, this.asyncRender).forEach((item, index) => {
                    this.copyItem(item, index);
                });
                if (this.data.length > this.asyncRender) {
                    this.shouldEachRenderQueue = true;
                    this.eachQueue(this.data, this.asyncRender, this._queueId);
                } else {
                    this.isRenderDone = true;
                    this.$emit('on-render-done');
                }
            } else {
                if (!this.isVirtualScroll) {
                    this.data.forEach((item, index) => {
                        this.copyItem(item, index);
                    });
                }
            }
        },
        copyItem(item, index) {
            const newItem = JSON.parse(JSON.stringify(item));
            newItem._isChecked = this.selectedData.length
                ? this.selectedData.includes(newItem[this.uniqueKey])
                : !!newItem._checked;
            newItem._isDisabled = !!newItem._disabled;
            newItem._expanded = newItem.expandStatus || !!newItem._expanded;
            newItem._disableExpand = !!newItem._disableExpand;
            this.$set(this.rowHeight, index, 0);
            this.dataList.push(newItem);
            // 出现页面滚动条时，重新计算宽度
            this.$nextTick(() => {
                const scrollBarWidth = this.showScrollBar ? 16 : 0;
                const nTableWidth = this.$el.offsetWidth - 2 - scrollBarWidth;
                if (this.fixedHeadStyle.width !== nTableWidth + 'px') {
                    this.fixedHeadStyle.width = nTableWidth + 'px';
                }
            });
        },
        eachQueue(arr, i, queueId) {
            if (!this.shouldEachRenderQueue) {
                return;
            }
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (this._queueId !== queueId) {
                        reject();
                    } else {
                        this.copyItem(arr[i], i++);
                        resolve();
                    }
                }, 0);
            })
                .then(() => {
                    if (arr.length <= i) {
                        this.doLayout();
                        this.isRenderDone = true;
                        this.$emit('on-render-done');
                        this.shouldEachRenderQueue = false;
                    } else {
                        this.eachQueue(arr, i, queueId);
                    }
                })
                .catch(() => {});
        },
        toggleSelect(index) {
            const row = this.dataList[index];
            let selection;
            if (!this.prefixData.length) {
                this.prefixData = JSON.parse(JSON.stringify(this.data));
            }
            if (!row._isDisabled) {
                // disabled 状态禁止更改 check 状态
                if (this.isVirtualScroll) {
                    const selectIndex = row.index - 1;
                    this.$set(
                        this.prefixData[selectIndex],
                        '_isChecked',
                        !this.prefixData[selectIndex]['_isChecked']
                    );
                } else {
                    row._isChecked = !row._isChecked;
                }
            }
            // 控制tableHeader是否处于全选状态
            let isCheckedAll;
            if (this.isVirtualScroll) {
                isCheckedAll = this.prefixData.every((item) => item._isChecked);
                selection = this.prefixData.filter(
                    (item) => item['_isChecked'] === true
                );
            } else {
                isCheckedAll = this.dataList.every((item) => item._isChecked);
                selection = this.getSelection();
            }

            if (!this.multiple && !row._disabled) {
                // 处理单选逻辑
                selection = [];
                const data = JSON.parse(JSON.stringify(this.dataList));
                for (const item of data) {
                    this.$set(
                        item,
                        '_isChecked',
                        this.getId(item) === this.getId(row)
                    );
                }
                this.dataList = Object.assign([], this.dataList, data);
                selection.push(row);
            }

            this.isSelectAll = isCheckedAll;
            this.$refs.tableHeader &&
                this.$refs.tableHeader.handleChangeStatus(isCheckedAll);
            const curRow = JSON.parse(JSON.stringify(row));
            if (!row._isChecked) {
                this.$emit('on-selection-cancel', curRow);
                this.isSelectAll = false;
            }
            this.$emit('on-selection-change', selection, curRow);
        },
        handleRowClick(index, row) {
            this.$emit('on-row-click', index, row);
            if (this.enableRowCheck) {
                this.toggleSelect(index);
            }
        },
        getSelection() {
            const selection = [];
            let data = [];
            if (this.isVirtualScroll) {
                data = this.data;
            } else {
                data = this.dataList;
            }
            data.forEach((item) => {
                if (item._isChecked) {
                    selection.push(item);
                }
            });
            return JSON.parse(JSON.stringify(selection));
        },
        selectAll(status) {
            this.isSelectAll = status;
            let selection;
            let cancelSelection;
            if (this.isVirtualScroll) {
                const prefixData = JSON.parse(JSON.stringify(this.data));
                this.dataList.forEach((item) => {
                    if (!item._isDisabled) {
                        // disabled 状态禁止更改 check 状态
                        item._isChecked = status;
                    }
                });
                prefixData.forEach((item) => {
                    if (!item._isDisabled) {
                        // disabled 状态禁止更改 check 状态
                        item._isChecked = status;
                    }
                });
                selection = prefixData;
                cancelSelection = prefixData;
                this.prefixData = prefixData;

                this.updateTable(true);

                // setTimeout(() => {
                // this.updateTable(true)

                // }, 2000)
            } else {
                this.dataList.forEach((item) => {
                    if (!item._isDisabled) {
                        // disabled 状态禁止更改 check 状态
                        item._isChecked = status;
                    }
                });
                selection = this.getSelection();
                cancelSelection = this.getSelection();
            }
            if (status) {
                this.$emit('on-selection-change', selection);
            } else {
                this.$emit('on-all-cancel', cancelSelection);
            }
        },
        onColResizeMove(e) {
            const colResize = this.colResize;
            if (colResize.onColResizing) {
                const currentX = e.clientX - colResize.nTableLeft;
                const dX = currentX - colResize.originX;
                if (dX < 0 && dX >= colResize.minX) {
                    // 限制参考线最小值
                    colResize.currentX = currentX;
                } else if (dX > 0 && dX <= colResize.maxX) {
                    colResize.currentX = currentX;
                }
            }
        },
        onColResizeEnd(e) {
            const colResize = this.colResize;
            if (colResize.onColResizing) {
                const col = this.tableColumns[colResize.resizeIndex];
                const dX = colResize.currentX - colResize.originX;
                let finalX = Math.max(
                    (col.width || this.calWidth[col.key]) + dX
                );
                finalX = this.limitWidth(finalX, col);
                this.$set(col, 'width', finalX);
                // reset
                colResize.onColResizing = false;
                colResize.currentX = 0;
                colResize.resizeIndex = -1;
                this.doLayout();
                this.emitColResize.newWidth = finalX;
                this.emitColResize.event = e;

                // 列宽拖拽结束后，回调返回
                this.$emit(
                    'on-col-width-resize',
                    this.emitColResize.newWidth,
                    this.emitColResize.oldWidth,
                    this.emitColResize.column,
                    this.emitColResize.event
                );
            }
        },
        onColResizeStart(e, index) {
            if (e.target.classList.contains('j-col-resize')) {
                e.stopPropagation();
                const colResize = this.colResize;
                const col = this.tableColumns[index];
                const colWidth = col.width || this.calWidth[col.key];
                const minWidth = this.getMinWidth(col);
                const maxWidth = this.getMaxWidth(col);
                colResize.onColResizing = true;
                colResize.resizeIndex = index;
                colResize.nTableLeft = this.$el.getBoundingClientRect().left;
                colResize.originX = colResize.currentX =
                    e.clientX - colResize.nTableLeft;
                colResize.minX = minWidth - colWidth;
                if (maxWidth !== undefined) {
                    colResize.maxX = maxWidth - colWidth;
                }
                this.emitColResize.oldWidth = colWidth;
                this.emitColResize.column = this.columns[index];
            }
        },
        handleScrollYScroll(e) {
            if (!this.scrollYScrolling) {
                return;
            }
            const scrollTop = e.target.scrollTop;
            this.scrollTop = scrollTop;
        },
        scrollBarOver() {
            this.scrollYScrolling = true;
        },
        scrollBarLeave() {
            this.scrollYScrolling = false;
        },
        onSortChange(item) {
            this.$emit('on-sort-change', item);
        },
        calHeight() {
            // requestAnimationFrame(() => {
            if (this.isVirtualScroll && !this.tableHeight) {
                return;
            }
            const $refs = this.$refs;
            const $tableFoot = $refs.tableFoot;
            const $tableBody = $refs.tableBody;
            if (!$tableBody) {
                return;
            }
            const $tableBodyTr = $tableBody.$el.querySelector('.flex-table-tr');
            const headerH = $refs.tableHeader.$el.offsetHeight;
            const bodyH = $tableBodyTr ? $tableBodyTr.offsetHeight : 0;
            const footH = $tableFoot ? $tableFoot.$el.offsetHeight : 0;
            this.headerH = headerH;
            this.footH = footH;
            this.bodyH = bodyH;
            if (!this.isVirtualScroll) {
                // this.maxHeight = this.tableHeight - headerH - footH;
                this.maxHeight = this.height - headerH - footH;
            } else {
                this.bodyH = this.totalHeight;
            }

            this.updateFixedScroll();
            // });
        },
        getMinWidth(col) {
            return col.minWidth || this.minWidth;
        },
        getMaxWidth(col) {
            return col.maxWidth || this.maxWidth;
        },
        limitWidth(currentWidth, col) {
            const minWidth = this.getMinWidth(col);
            const maxWidth = this.getMaxWidth(col);
            currentWidth = Math.max(currentWidth, minWidth);
            if (maxWidth !== undefined) {
                currentWidth = Math.min(currentWidth, maxWidth);
            }
            return currentWidth;
        },
        getTableOffset() {
            const element = this.$el;
            let actualLeft = element.offsetLeft;
            let actualTop = element.offsetTop;
            let current = element.offsetParent;
            while (current !== null) {
                actualLeft += current.offsetLeft;
                actualTop += current.offsetTop;
                current = current.offsetParent;
            }
            return {
                left: actualLeft,
                top: actualTop,
            };
        },
        winScroll() {
            const sTop =
                document.body.scrollTop + document.documentElement.scrollTop;
            const tableOffset = this.getTableOffset();
            let startFixedHead = sTop > tableOffset.top; // checkFixedHeadTop

            if (this.checkFixedHeadTop) {
                startFixedHead = this.checkFixedHeadTop();
            }

            if (startFixedHead) {
                this.isFixedHead = true;
                this.fixedHeadStyle.left =
                    tableOffset.left + (this.border ? 1 : 0) + 'px';
                this.fixedHeadStyle.position = 'fixed';
                this.fixedHeadStyle.top = this.fixedHeadTop + 'px';
            } else {
                this.isFixedHead = false;
                this.fixedHeadStyle.position = 'absolute';
                this.fixedHeadStyle.left = 0;
                this.fixedHeadStyle.top = 0;
            }
        },
        resize() {
            this.$nextTick(() => {
                // wrapper 宽度
                const scrollBarWidth = this.showScrollBar ? 16 : 0;
                const nTableWidth = this.$el.offsetWidth - 2 - scrollBarWidth;
                this.fixedHeadStyle.width = nTableWidth + 'px';

                const oWidth = {};
                let defineTotalWidth = 0; //定义的宽度总和
                let nCalLength = 0;

                //计算每一个单元的宽度
                this.tableColumns.forEach((item) => {
                    let sKey = item.key || item.title;
                    let nWidth = item.width;
                    if (nWidth) {
                        nWidth = this.limitWidth(nWidth, item);
                        oWidth[sKey] = nWidth;
                        defineTotalWidth += nWidth;
                    } else {
                        nCalLength++;
                    }
                });
                // 给没有定义宽度的 cell 平均分配或指定最小宽度
                if (nCalLength > 0) {
                    let nLessWidth = nTableWidth - defineTotalWidth;
                    let nCalWidth = nLessWidth / nCalLength; //计算出来的宽度

                    this.tableColumns.forEach((item) => {
                        let sKey = item.key || item.title;
                        let nWidth = item.width;
                        if (!nWidth) {
                            const autoWidth = this.limitWidth(nCalWidth, item);
                            oWidth[sKey] = autoWidth;
                        }
                    });
                } else if (
                    nTableWidth > defineTotalWidth &&
                    this.autoCalWidth
                ) {
                    let dWidth =
                        (nTableWidth - defineTotalWidth) /
                        this.tableColumns.length;
                    dWidth = dWidth > 0 ? dWidth : 0;
                    this.tableColumns.forEach((item) => {
                        let sKey = item.key || item.title;
                        oWidth[sKey] = oWidth[sKey] + dWidth;
                    });
                }
                // 计算真实宽度
                const nTotalWidth = Object.keys(oWidth).reduce(
                    (total, key) => total + oWidth[key],
                    0
                );
                if (this.autoCalWidth) {
                    this.style = {
                        'min-width': Math.max(nTableWidth, nTotalWidth) + 'px',
                    };
                } else {
                    // 宽度不能超过table的宽度，否则出现双滚动条
                    const wrapWidth =
                        nTableWidth < nTotalWidth ? 'auto' : nTotalWidth + 'px';
                    this.wrapStyle = {
                        width: `${wrapWidth}`,
                    };
                    this.style = {
                        width: `${nTotalWidth}px`,
                    };
                }

                this.calWidth = oWidth;
            });
        },
        onRowHeightChange(row) {
            if (!this.isVirtualScroll) {
                this.$set(this.rowHeight, row.rowIndex, row.height);
            }
        },
        reSetItemHeight() {
            // 这里给 height 赋值是为了出现滚动条
            if (this.isVirtualScroll) {
                if (this.height) {
                    this.tableHeight = this.height;
                } else {
                    this.tableHeight = this.maxHeight;
                }
                this.calHeight();
            }
        },
        updateTable(isDataChange) {
            const { data, maxIndex, itemHeight, poolSize } = this;

            const currentIndex = Math.floor(
                this.$refs.tableBody.scrollTop / itemHeight
            );
            let startIndex = Math.min(maxIndex, currentIndex);

            // 当前列表的索引发生实际变化或者源数据有增减时才进行更新
            const shouldUpdate =
                this.prevStartIndex !== startIndex || isDataChange;

            // if (!shouldUpdate) return;

            // 获取滚动方向和差值，优化滚动性能和复用DOM
            const direction = startIndex - this.prevStartIndex || 0;
            const endIndex = 2 + startIndex + poolSize;
            this.updateScrollData(
                startIndex,
                endIndex,
                direction,
                isDataChange
            );
            this.prevStartIndex = startIndex;
            // this.requestId && cancelAnimationFrame(this.requestId);
        },
        updateScrollData(startIndex, endIndex, direction, isDataChange) {
            const { data, itemHeight, dataList, isSameDataRef, isSelectAll } =
                this;
            if (!data.length) {
                this.isSelectAll = false;
                this.prefixData = [];
            } else {
                this.prefixData = Object.assign([], data, this.prefixData);
            }
            if (!dataList.length || !isSameDataRef) {
                // reset flag
                this.isSameDataRef = true;
                let prefixData = JSON.parse(
                    JSON.stringify(this.prefixData)
                ).slice(startIndex, endIndex);
                const newData = data
                    .slice(startIndex, endIndex)
                    .map((item, index) => ({
                        item,
                        top: startIndex * itemHeight,
                        pos: startIndex++,
                        index: startIndex,
                        _isChecked: false,
                    }));

                if (!prefixData.length) {
                    prefixData = newData;
                }

                newData.forEach((news, index) => {
                    Object.keys(news.item).forEach((key, newIndex) => {
                        if (prefixData[index]) {
                            const prefixDataId = prefixData[index].item
                                ? this.getId(prefixData[index].item)
                                : this.getId(prefixData[index]);
                            // 这里加多了一层判断逻辑，处理删除表格数据时，数据项对应不上的问题
                            const isCheck =
                                prefixData[index] &&
                                data.some(
                                    (item) => this.getId(item) === prefixDataId
                                )
                                    ? prefixData[index]['_isChecked']
                                    : false;
                            news[key] = news.item[key];
                            news['_isChecked'] = isSelectAll ? true : isCheck; // 若为全选，每次滚动加载数据时勾上
                        }
                    });
                });
                // return (this.dataList = newData);
                if (isDataChange) {
                    this.dataList = [];
                }
                setTimeout(() => {
                    this.dataList = Object.assign([], newData);
                }, 0);
            }
        },

        getScrollContainer() {
            let scrollContainer = document;
            if (typeof this.scrollContainer === 'string') {
                scrollContainer = document.querySelector(this.scrollContainer);
            } else if (this.scrollContainer instanceof Element) {
                scrollContainer = this.scrollContainer;
            }
            return scrollContainer;
        },

        initFixedScrollListener() {
            const container = this.getScrollContainer();
            this._scrollContainer = container;
            this.containerScrollFn = () => {
                this.updateFixedScroll();
            };
            container.addEventListener('scroll', this.containerScrollFn);
        },

        updateFixedScroll() {
            if (!this.fixedXScroll) {
                return;
            }
            const fixedXScroll = this.$refs.fixedXScroll;
            const flexTableLayout = this.$refs.flexTableLayout;
            const { width, bottom } = flexTableLayout.getBoundingClientRect();
            if (bottom < window.innerHeight) {
                fixedXScroll.style.display = 'none';
            } else {
                fixedXScroll.style.display = 'block';
                const fixedScrollContent = fixedXScroll.querySelector(
                    '.flex-table-fixed-scroll-content'
                );
                fixedXScroll.style.width = `${width}px`;
                fixedXScroll.style.bottom = `${this.fixedXScrollBottom}px`;
                fixedScrollContent.style.width = `${flexTableLayout.scrollWidth}px`;
                fixedXScroll.scrollLeft = this.scrollLeft;
            }
        },

        updateFixedScrollLeft(left) {
            if (!this.fixedXScroll) {
                return;
            }
            const fixedXScroll = this.$refs.fixedXScroll;
            if (fixedXScroll) {
                fixedXScroll.scrollLeft = left;
            }
        },

        getId(item) {
            return item[this.uniqueKey];
        },

        getheadHeight(height){
            this.headHeight = height
        }
    },
};
</script>
<style lang="less" scoped>
.flex-table-head-fixed {
    overflow-x: hidden;
}
.flex-table {
    width: fit-content;
}
</style>