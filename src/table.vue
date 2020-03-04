<template>
    <div :class="wrapClasses" ref="tableWrap">
    <div
        class="flex-table-layout"
        ref="flexTableLayout"
        @scroll="onScroll"
        @mousewheel="handleMousewheel"
        @DOMMouseScroll="handleMousewheel"
    >
        <div class="flex-table" :style="style">
            <table-head
                ref="tableHeader"
                :cal-width="calWidth"
                :columns="tableColumns"
                :data="dataList"
                :resizable="resizable"
                @on-select-all="selectAll"
                @on-sort-change="onSortChange"
                @on-col-resize="onColResizeStart"
                :style="fixedHead ? 'visibility: hidden;' : ''"
            ></table-head>
            <!-- /flex-table-head -->

            <table-body
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
                @scroll.native.passive="syncScroll"
                @on-toggle-select="toggleSelect"
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

        <div :class="['flex-table-fixed-left', bodyIsScroll > 0 ? 'is-scroll' : '']" v-if="hasFixedLeft" :style="{'width': fixedLeftWidth + 'px'}">
            <table-head
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
            ></table-head>

            <table-body
                ref="fixedLeftBody"
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

        <div :class="['flex-table-fixed-right-wrap']" v-if="hasFixedRight" :style="{'width': fixedRightWidth + 'px'}">
            <div class="flex-table-fixed-right">
                <table-head
                    :cal-width="calWidth"
                    :columns="tableColumns"
                    onlyFixed="right"
                    :data="dataList"
                    :resizable="resizable"
                    :rowHeight="rowHeight.header"
                    :is-render-done="isRenderDone"
                    @on-select-all="selectAll"
                    @on-sort-change="onSortChange"
                    @on-col-resize="onColResizeStart"
                ></table-head>

                <table-body
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

        <div class="flex-table-reference-line" :class="{'cur': colResize.currentX !== 0}" :style="{'left': `${colResize.currentX}px`}"></div>
        <slot name="loading" v-if="loading">
            <Spinner fix size="large"></Spinner>
        </slot>
    </div>
    <div :class="getFixedHeadClass" :style="fixedHeadStyle" v-if="fixedHead">
        <div
            class="flex-table-head-fixed"
            ref="flexTableFixedHead"
            @mousewheel="handleMousewheel"
            @DOMMouseScroll="handleMousewheel"
        >
            <div class="flex-table" :style="style">
                <table-head
                    ref="tableHeader"
                    :cal-width="calWidth"
                    :columns="tableColumns"
                    :data="dataList"
                    :resizable="resizable"
                    @on-select-all="selectAll"
                    @on-sort-change="onSortChange"
                    @on-col-resize="onColResizeStart"
                ></table-head>
                <!-- /flex-table-head -->
            </div>
            <div :class="['flex-table-fixed-left', bodyIsScroll > 0 ? 'is-scroll' : '']" v-if="hasFixedLeft" :style="{'width': fixedLeftWidth + 'px'}">
                <table-head
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
                ></table-head>
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
import tableScrollBar from './tableScrollBar.vue';
import Spinner from './Spinner.vue';
import debounce from "lodash.debounce";
import throttle from "lodash.throttle";
import normalizeWheel from 'normalize-wheel';

import { MIN_WIDTH } from './data';

const prefixCls = 'flex-table';

let tableIdSeed = 1;
export default {
    name: "flexTable",
    components: {
        tableHead,
        tableBody,
        tableFoot,
        tableScrollBar,
        Spinner,
    },
    props: {
        data: {
            type: Array,
            default () {
                return [];
            }
        },
        sum: {
            type: [Object, Boolean],
        },
        columns: {
            type: Array,
            default () {
                return [];
            }
        },
        loading: {
            type: Boolean,
            default: false
        },
        height: {
            type: Number
        },
        resizable: {
            type: Boolean,
            default: false,
        },
        noData: {
            type: String,
            default: 'No Data'
        },
        size: {
            type: String,
            default: 'default'
        },
        theme: {
            type: String,
            default: 'light'
        },
        border: {
            type: Boolean,
            default: true
        },
        stripe: {
            type: Boolean,
            default: true
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
            default: false
        },
        fixedHeadTop: {
            type: Number,
            default: 0
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
        }
    },
    data(){
        return {
            tableId: tableIdSeed++,
            rowHeight: { header: 0, footer: 0 },
            dataList: [],
            style:{},
            calWidth: {},
            tableColumns: [],
            headerH: 38,
            bodyH: 0,
            footH: 54,
            maxHeight: 0,
            scrollTop: 0,
            scrollLeft: 0,
            bodyIsScroll: 0,
            shouldEachRenderQueue: false,
            hasFixedLeft: false,
            hasFixedRight: false,
            scrollYScrolling: false,
            hoverIndex: undefined,
            isRenderDone: true,
            fixedHeadStyle: {},
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
                event: null
            }
        }
    },
    computed: {
        wrapClasses () {
            let arr = [`${prefixCls}-wrap`];
            if (this.size === 'big') {
                arr.push(`${prefixCls}-big`)
            } else if (this.size === 'small') {
                arr.push(`${prefixCls}-small`)
            }
            if (this.theme === 'dark') {
                arr.push(`${prefixCls}-dark`)
            }
            if (this.showScrollBar) {
                arr.push('has-scroll-bar')
            }
            if (!this.border) {
                arr.push(`no-boder`)
            }
            if (!this.stripe) {
                arr.push(`no-stripe`)
            }
            return arr;
        },
        fixedLeftWidth: function() {
            return this.tableColumns.reduce((width, item) => {
                if (item.fixed === 'left') {
                    width += this.calWidth[item.key];
                }
                return width;
            }, 0);
        },
        fixedRightWidth: function() {
            return this.tableColumns.reduce((width, item) => {
                if (item.fixed === 'right') {
                    width += this.calWidth[item.key];
                }
                return width;
            }, 0);
        },
        showScrollBar: function() {
            return this.bodyH > this.maxHeight;
        },
        getFixedHeadClass: function() {
            if (this.isFixedHead) {
                return 'flex-table-head-fixed-layout is-fixed';
            }
            return 'flex-table-head-fixed-layout';
        }
    },
    mounted(){
        this.doLayout();
        window.addEventListener('resize',this.doLayout);
        window.addEventListener('scroll',this.winScroll, false);
        if (this.resizable) {
            window.addEventListener('mouseup', this.onColResizeEnd);
            this.$el.addEventListener('mousemove', this.onColResizeMove);
        }
    },
    watch: {
        data: {
            handler: function() {
                this.initData();
                this.doLayout();
            },
            deep: true,
            immediate: true,
        },
        height: function(val){
            this.calHeight();
        },
        columns: {
            handler: function(arr) {
                // sort cols
                const fixedLeftColumns = [];
                const fixedRightColumns = [];
                const ordinaryColumns = [];
                arr.forEach(col => {
                    if (col.fixed === 'left') {
                        fixedLeftColumns.push(col);
                    } else if (col.fixed === 'right') {
                        fixedRightColumns.push(col);
                    } else {
                        ordinaryColumns.push(col);
                    }
                });
                this.tableColumns = [].concat(fixedLeftColumns, ordinaryColumns, fixedRightColumns);
            },
            immediate: true,
        },
        tableColumns: {
            handler: function(arr) {
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
        sum: function() {
            this.calHeight();
        },
        showScrollBar() {
            this.resize();
        },
        scrollLeft(left) {
            this.$refs.flexTableLayout.scrollLeft = left;
            const flexTableFixedHead = this.$refs.flexTableFixedHead;
            if (flexTableFixedHead) {
                flexTableFixedHead.scrollLeft = left;
            }
        }
    },
    updated() {},
    beforeDestroy() {
        this.shouldEachRenderQueue = false;
        this._queueId = null;
        window.removeEventListener('resize',this.doLayout);
        window.removeEventListener('scroll',this.winScroll, false);
        window.removeEventListener('mouseup', this.onColResizeEnd);
        this.$el.removeEventListener('mousemove', this.onColResizeMove);
    },
    beforeCreate() {
        const self = this;
        this.doLayout = debounce(function() {
            self.resize();
            self.calHeight();
        }, 50, {leading: true});
    },
    methods:{
        onScroll(event) {
            // 兼容拖动滚动条
            this.scrollLeft = event.target.scrollLeft;
        },
        syncScroll: throttle(function(event) {
            const { scrollTop } = event.target;
            this.scrollTop = scrollTop;
        }, 20),
        updateHoverIndex: debounce(function(index) {
            this.hoverIndex = index;
        }, 100),
        handleMousewheel(event) {
            const normalized = normalizeWheel(event);
            if (Math.abs(normalized.spinY) > 0) {
                const bodyWrapper = this.$refs.tableBody.$el;
                const currentScrollTop = this.scrollTop;
                const noYetScrollToTop = normalized.pixelY < 0 && currentScrollTop > 0;
                const noYetScrollToBottom = normalized.pixelY > 0 && bodyWrapper.scrollHeight - bodyWrapper.clientHeight > currentScrollTop;
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
                const noYetScrollToLeft = normalized.pixelX < 0 && currentScrollLeft > 0;
                const noYetScrollToRight = normalized.pixelX > 0 && bodyWrapper.clientWidth - tableLayout.clientWidth > currentScrollLeft;
                if (noYetScrollToLeft || noYetScrollToRight) {
                    event.preventDefault();
                    this.scrollLeft += Math.ceil(normalized.pixelX);
                    this.scrollLeft = Math.max(this.scrollLeft, 0);
                    this.$emit('on-scroll-x', event);
                }
            }
        },
        computedFixedLeft: function() {
            return this.tableColumns.some(item => item.fixed === 'left');
        },
        computedFixedRight: function() {
            return this.tableColumns.some(item => item.fixed === 'right');
        },
        initData() {
            this._queueId = new Date().getTime();
            this.rowHeight = { header: 0, footer: 0 };
            this.dataList = [];
            if (this.asyncRender > 0) {
                this.isRenderDone = false;
                this.data.slice(0, this.asyncRender).forEach((item, index) => {
                    this.copyItem(item, index)
                });
                if (this.data.length > this.asyncRender) {
                    this.shouldEachRenderQueue = true;
                    this.eachQueue(this.data, this.asyncRender, this._queueId);
                } else {
                    this.isRenderDone = true;
                    this.$emit("on-render-done");
                }
            } else {
                this.data.forEach((item, index) => {
                    this.copyItem(item, index)
                });
            }
        },
        copyItem(item, index) {
            const newItem = JSON.parse(JSON.stringify(item));
            newItem._isChecked = !!newItem._checked;
            newItem._isDisabled = !!newItem._disabled;
            newItem._expanded = newItem.expandStatus || !!newItem._expanded;
            newItem._disableExpand = !!newItem._disableExpand;
            this.$set(this.rowHeight, index, 0);
            this.dataList.push(newItem);
            // 出现页面滚动条时，重新计算宽度
            this.$nextTick(() => {
                const scrollBarWidth = this.showScrollBar ? 16 : 0;
                const nTableWidth = this.$el.offsetWidth - 2 - scrollBarWidth;
                if (this.fixedHeadStyle.width !== nTableWidth + 'px'){
                    this.fixedHeadStyle.width = nTableWidth + 'px';
                }
            })
        },
        eachQueue(arr, i, queueId) {
            if (!this.shouldEachRenderQueue) { return; }
            return new Promise((resolve, reject) => {
                requestAnimationFrame(() => {
                    if (this._queueId !== queueId) {
                        reject();
                    } else {
                        this.copyItem(arr[i], i++);
                        resolve();
                    }
                });
            }).then(() => {
                if (arr.length <= i) {
                    this.doLayout();
                    this.isRenderDone = true;
                    this.$emit("on-render-done");
                    this.shouldEachRenderQueue = false;
                } else {
                    this.eachQueue(arr, i, queueId);
                }
            }).catch(() => {})
        },
        toggleSelect(index) {
            const row = this.dataList[index];
            if (!row._isDisabled) { // disabled 状态禁止更改 check 状态
                row._isChecked = !row._isChecked;
            }

            const selection = this.getSelection();
            const curRow = JSON.parse(JSON.stringify(row));
            if(!row._isChecked){
                this.$emit('on-selection-cancel', curRow);
            }
            this.$emit('on-selection-change', selection, curRow);
        },
        getSelection() {
            const selection = [];
            this.dataList.forEach(item => {
                if (item._isChecked) {
                    selection.push(item);
                }
            });
            return JSON.parse(JSON.stringify(selection));
        },
        selectAll(status) {
            const cancelSelection = this.getSelection();
            this.dataList.forEach(item => {
                if (!item._isDisabled) { // disabled 状态禁止更改 check 状态
                    item._isChecked = status;
                }
            });
            const selection = this.getSelection();
            if(status){
                this.$emit('on-selection-change', selection);
            }else{
                this.$emit('on-all-cancel', cancelSelection);
            }
        },
        onColResizeMove(e) {
            const colResize = this.colResize
            if (colResize.onColResizing) {
                const currentX = e.clientX - colResize.nTableLeft;
                const dX = currentX - colResize.originX;
                if (dX < 0 && dX >= colResize.minX) { // 限制参考线最小值
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
                let finalX = Math.max((col.width || this.calWidth[col.key]) + dX);
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
                this.$emit('on-col-width-resize', 
                            this.emitColResize.newWidth, 
                            this.emitColResize.oldWidth, 
                            this.emitColResize.column, 
                            this.emitColResize.event
                )
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
                colResize.originX = colResize.currentX = e.clientX - colResize.nTableLeft;
                colResize.minX = minWidth - colWidth;
                if (maxWidth !== undefined) {
                    colResize.maxX = maxWidth - colWidth;
                }
                this.emitColResize.oldWidth  = colWidth;
                this.emitColResize.column = this.columns[index];
            }
        },
        handleScrollYScroll(e) {
            if(!this.scrollYScrolling) { return; }
            const scrollTop = e.target.scrollTop;
            this.scrollTop = scrollTop;
        },
        scrollBarOver(){
            this.scrollYScrolling = true;
        },
        scrollBarLeave(){
            this.scrollYScrolling = false;
        },
        onSortChange(item) {
            this.$emit('on-sort-change', item);
        },
        calHeight() {
            requestAnimationFrame(() => {
                if (!this.height) { return; }
                const $refs = this.$refs;
                const $tableFoot = $refs.tableFoot;
                const $tableBody = $refs.tableBody;
                if (!$tableBody) { return; }
                const $tableBodyTr = $tableBody.$el.querySelector('.flex-table-tr');
                const headerH = $refs.tableHeader.$el.offsetHeight;
                const bodyH = $tableBodyTr ? $tableBodyTr.offsetHeight : 0;
                const footH = $tableFoot ? $tableFoot.$el.offsetHeight : 0;
                this.headerH = headerH;
                this.footH = footH;
                this.bodyH = bodyH;
                this.maxHeight = this.height - headerH - footH;
            });
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
            while (current !== null){
                actualLeft += current.offsetLeft;
                actualTop += current.offsetTop;
                current = current.offsetParent;
            }
            return {
                left: actualLeft,
                top: actualTop
            }
        },
        winScroll() {
            const sTop = document.body.scrollTop + document.documentElement.scrollTop;
            const tableOffset = this.getTableOffset();
            if (sTop > tableOffset.top) {
                this.isFixedHead = true;
                this.fixedHeadStyle.left = tableOffset.left + (this.border ? 1 : 0) + 'px';
                this.fixedHeadStyle.position = 'fixed';
                this.fixedHeadStyle.top = this.fixedHeadTop + 'px';
            } else {
                this.isFixedHead = false;
                this.fixedHeadStyle.position = 'absolute';
                this.fixedHeadStyle.left = 0;
                this.fixedHeadStyle.top = 0;
            }
        },
        resize(){
            requestAnimationFrame(() => {
                // wrapper 宽度
                const scrollBarWidth = this.showScrollBar ? 16 : 0;
                const nTableWidth = this.$el.offsetWidth - 2 - scrollBarWidth;
                this.fixedHeadStyle.width = nTableWidth + 'px';

                const oWidth = {};
                let defineTotalWidth = 0; //定义的宽度总和
                let nCalLength = 0;

                //计算每一个单元的宽度
                this.tableColumns.forEach(item => {
                    let sKey = item.key || item.title;
                    let nWidth = item.width;
                    if(nWidth){
                        nWidth = this.limitWidth(nWidth, item);
                        oWidth[sKey] = nWidth;
                        defineTotalWidth += nWidth;
                    }else{
                        nCalLength++;
                    }
                });
                // 给没有定义宽度的 cell 平均分配或指定最小宽度
                if (nCalLength > 0) {
                    let nLessWidth = nTableWidth - defineTotalWidth;
                    let nCalWidth = nLessWidth/nCalLength; //计算出来的宽度

                    this.tableColumns.forEach(item=>{
                        let sKey = item.key || item.title;
                        let nWidth = item.width;
                        if(!nWidth){
                            const autoWidth = this.limitWidth(nCalWidth, item);
                            oWidth[sKey] = autoWidth;
                        }
                    });
                } else if (nTableWidth > defineTotalWidth) {
                    let dWidth = (nTableWidth-defineTotalWidth)/this.tableColumns.length;
                    dWidth = dWidth > 0 ? dWidth : 0;
                    this.tableColumns.forEach(item=>{
                        let sKey = item.key || item.title;
                        oWidth[sKey] = oWidth[sKey] + dWidth;
                    });
                }
                // 计算真实宽度
                const nTotalWidth = Object.keys(oWidth).reduce((total, key) => (total + oWidth[key]), 0);
                this.style = {
                    'min-width': Math.max(nTableWidth, nTotalWidth)+'px'
                };
                this.calWidth = oWidth;
            });
        },
        onRowHeightChange(row) {
            this.$set(this.rowHeight, row.rowIndex, row.height);
        }
    }
}
</script>
