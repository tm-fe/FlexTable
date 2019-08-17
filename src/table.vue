<template>
    <div :class="wrapClasses">
    <div class="flex-table-layout">
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

            <table-body
                ref="tableBody"
                :cal-width="calWidth"
                :columns="tableColumns"
                :data="dataList"
                :maxHeight="maxHeight"
                :scroll="handleBodyScroll"
                :no-data="noData"
                :hover="bodyScrollOver"
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

        <div class="flex-table-fixed-left" v-if="hasFixedLeft" :style="{'width': fixedLeftWidth + 'px'}">
            <table-head
                :cal-width="calWidth"
                :columns="tableColumns"
                onlyFixed="left"
                :data="dataList"
                :resizable="resizable"
                :rowHeight="rowHeight.header"
                @on-select-all="selectAll"
                @on-sort-change="onSortChange"
                @on-col-resize="onColResizeStart"
            ></table-head>

            <table-body
                ref="fixedLeftBody"
                onlyFixed="left"
                :scroll="handleFixedBodyScroll"
                :cal-width="calWidth"
                :columns="tableColumns"
                :data="dataList"
                :maxHeight="maxHeight"
                :hover="fixedScrollOver"
                :rowHeight="rowHeight"
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

        <div class="flex-table-fixed-right-wrap" v-if="hasFixedRight" :style="{'width': fixedRightWidth + 'px'}">
            <div class="flex-table-fixed-right">
                <table-head
                    :cal-width="calWidth"
                    :columns="tableColumns"
                    onlyFixed="right"
                    :data="dataList"
                    :resizable="resizable"
                    :rowHeight="rowHeight.header"
                    @on-select-all="selectAll"
                    @on-sort-change="onSortChange"
                    @on-col-resize="onColResizeStart"
                ></table-head>

                <table-body
                    ref="fixedRightBody"
                    onlyFixed="right"
                    :scroll="handleFixedRightBodyScroll"
                    :cal-width="calWidth"
                    :columns="tableColumns"
                    :data="dataList"
                    :maxHeight="maxHeight"
                    :hover="fixedRightScrollOver"
                    :rowHeight="rowHeight"
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
    <tableScrollBar
        :body-h="bodyH"
        :header-h="headerH"
        :max-height="maxHeight"
        :scroll="handleScrollYScroll"
        :sum="!!sum"
        ref="scrollYBody"
        :hover="scrollScrollOver"
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
        initRowNumber: {
            type: Number,
            default: 10,
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
            shouldEachRenderQueue: false,
            hasFixedLeft: false,
            hasFixedRight: false,
            bodyScrolling: false,
            fixedBodyScrolling: false,
            fixedRightBodyScrolling: false,
            scrollYScrolling: false,
            colResize: {
                onColResizing: false,
                originX: 0, // 记录拖动起点
                currentX: 0, // 拖动实时位置
                resizeIndex: -1, // 调整的表头 index
                minX: 0, // 可拖动调整最小值
            },
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
        }
    },
    mounted(){
        this.doLayout();
        window.addEventListener('resize',this.doLayout);
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
        }
    },
    updated() {},
    beforeDestroy() {
        this.shouldEachRenderQueue = false;
        this._queueId = null;
        window.removeEventListener('resize',this.doLayout);
        window.removeEventListener('mouseup', this.onColResizeEnd);
        this.$el.removeEventListener('mousemove', this.onColResizeMove);
    },
    methods:{
        doLayout: debounce(function() {
            this.$nextTick(() => {
                this.resize();
                this.calHeight();
            });
        }, 50, {leading: true}),
        computedFixedLeft: function() {
            return this.tableColumns.some(item => item.fixed === 'left');
        },
        computedFixedRight: function() {
            return this.tableColumns.some(item => item.fixed === 'right');
        },
        initData() {
            this.rowHeight = { header: 0, footer: 0 };
            this.dataList = [];
            this.data.slice(0, this.initRowNumber).forEach((item, index) => {
                this.copyItem(item, index)
            });
            if (this.data.length > this.initRowNumber) {
                this.shouldEachRenderQueue = true;
                this._queueId = new Date().getTime();
                this.eachQueue(this.data, this.initRowNumber, this._queueId);
            } else {
                this.$emit("on-render-done");
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
                if (dX >= colResize.minX) { // 限制参考线最小值
                    colResize.currentX = currentX;
                }
            }
        },
        onColResizeEnd(e) {
            const colResize = this.colResize;
            if (colResize.onColResizing) {
                const row = this.tableColumns[colResize.resizeIndex];
                const dX = colResize.currentX - colResize.originX;
                const finalX = Math.max((row.width || this.calWidth[row.key]) + dX, MIN_WIDTH);
                if (row.width) {
                    row.width = finalX;
                } else {
                    this.$set(row, 'width', finalX);
                }
                // reset
                colResize.onColResizing = false;
                colResize.currentX = 0;
                colResize.resizeIndex = -1;
            }
        },
        onColResizeStart(e, index) {
            if (e.target.classList.contains('j-col-resize')) {
                e.stopPropagation();
                const colResize = this.colResize;
                const row = this.tableColumns[index];
                const colWidth = row.width || this.calWidth[row.key];
                colResize.onColResizing = true;
                colResize.resizeIndex = index;
                colResize.nTableLeft = this.$el.getBoundingClientRect().left;
                colResize.originX = colResize.currentX = e.clientX - colResize.nTableLeft;
                colResize.minX = MIN_WIDTH - colWidth;
            }
        },
        handleFixedBodyScroll(e) {
            if(this.bodyScrolling || this.scrollYScrolling || this.fixedRightBodyScrolling) return;
            this.fixedBodyScrolling = true;
            const scrollTop = e.target.scrollTop;
            this.$refs.tableBody.$el.scrollTop = scrollTop;
            if (this.hasFixedRight) {this.$refs.fixedRightBody.$el.scrollTop = scrollTop;}
            if(this.bodyH > this.maxHeight) this.$refs.scrollYBody.$refs.scrollYBody.scrollTop = scrollTop;
        },
        handleFixedRightBodyScroll(e) {
            if(this.bodyScrolling || this.scrollYScrolling || this.fixedBodyScrolling) return;
            this.fixedRightBodyScrolling = true;
            const scrollTop = e.target.scrollTop;
            this.$refs.tableBody.$el.scrollTop = scrollTop;
            if (this.hasFixedLeft) {this.$refs.fixedLeftBody.$el.scrollTop = scrollTop;}
            if(this.bodyH > this.maxHeight) this.$refs.scrollYBody.$refs.scrollYBody.scrollTop = scrollTop;
        },
        handleBodyScroll(e) {
            if(this.scrollYScrolling || this.fixedBodyScrolling || this.fixedRightBodyScrolling) return;
            this.bodyScrolling = true;
            const scrollTop = e.target.scrollTop;
            if (this.hasFixedLeft) {this.$refs.fixedLeftBody.$el.scrollTop = scrollTop;}
            if (this.hasFixedRight) {this.$refs.fixedRightBody.$el.scrollTop = scrollTop;}
            if(this.bodyH > this.maxHeight) this.$refs.scrollYBody.$refs.scrollYBody.scrollTop = scrollTop;
        },
        handleScrollYScroll(e) {
            if(this.bodyScrolling || this.fixedBodyScrolling || this.fixedRightBodyScrolling) return;
            this.scrollYScrolling = true;
            const scrollTop = e.target.scrollTop;
            this.$refs.tableBody.$el.scrollTop = scrollTop;
            if (this.hasFixedLeft) {this.$refs.fixedLeftBody.$el.scrollTop = scrollTop;}
            if (this.hasFixedRight) {this.$refs.fixedRightBody.$el.scrollTop = scrollTop;}
        },
        bodyScrollOver(){
            this.bodyScrolling = true;
            this.fixedBodyScrolling = false;
            this.fixedRightBodyScrolling = false;
            this.scrollYScrolling = false;
        },
        fixedScrollOver(){
            this.bodyScrolling = false;
            this.fixedBodyScrolling = true;
            this.fixedRightBodyScrolling = false;
            this.scrollYScrolling = false;
        },
        fixedRightScrollOver(){
            this.bodyScrolling = false;
            this.fixedBodyScrolling = false;
            this.fixedRightBodyScrolling = true;
            this.scrollYScrolling = false;
        },
        scrollScrollOver(){
            this.bodyScrolling = false;
            this.fixedBodyScrolling = false;
            this.fixedRightBodyScrolling = false;
            this.scrollYScrolling = true;
        },
        onSortChange(item) {
            this.$emit('on-sort-change', item);
        },
        calHeight() {
            if (!this.height) { return; }
            const $refs = this.$refs;
            const $tableFoot = $refs.tableFoot;
            const $tableBodyTr = $refs.tableBody.$el.querySelector('.flex-table-tr');
            const headerH = $refs.tableHeader.$el.offsetHeight;
            const bodyH = $tableBodyTr ? $tableBodyTr.offsetHeight : 0;
            const footH = $tableFoot ? $tableFoot.$el.offsetHeight : 0;
            this.headerH = headerH;
            this.footH = footH;
            this.bodyH = bodyH;
            this.maxHeight = this.height - headerH - footH;
        },
        resize(){
            requestAnimationFrame(() => {
                // wrapper 宽度
                const scrollBarWidth = this.showScrollBar ? 16 : 0;
                const nTableWidth = this.$el.offsetWidth - 2 - scrollBarWidth;

                const oWidth = {};
                let defineTotalWidth = 0; //定义的宽度总和
                let nCalWidth = 0 ; //计算出来的宽度
                let nCalLength = 0;

                //计算每一个单元的宽度
                this.tableColumns.forEach(item => {
                    let sKey = item.key || item.title;
                    let nWidth = item.width;
                    if(nWidth){
                        nWidth = Math.max(nWidth,MIN_WIDTH);
                        oWidth[sKey] = nWidth;
                        defineTotalWidth += nWidth;
                    }else{
                        nCalLength++;
                    }
                });
                // 给没有定义宽度的 cell 平均分配或指定最小宽度
                if (nCalLength > 0) {
                    let nLessWidth = nTableWidth - defineTotalWidth;
                    nCalWidth = Math.max(nLessWidth/nCalLength, MIN_WIDTH);

                    this.tableColumns.forEach(item=>{
                        let sKey = item.key || item.title;
                        let nWidth = item.width;
                        if(!nWidth){
                            oWidth[sKey] = nCalWidth ;
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
