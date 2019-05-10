<template>
    <div class="flex-table-wrap">
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

        <div class="flex-table-fixed" v-if="hasFixed" :style="{'width': fixedLeftWidth + 'px'}">
            <table-head
                :cal-width="calWidth"
                :columns="tableColumns"
                :onlyFixed="true"
                :data="dataList"
                :resizable="resizable"
                @on-select-all="selectAll"
                @on-sort-change="onSortChange"
                @on-col-resize="onColResizeStart"
            ></table-head>

            <table-body
                ref="fixedLeftBody"
                :onlyFixed="true"
                :scroll="handleFixedBodyScroll"
                :cal-width="calWidth"
                :columns="tableColumns"
                :data="dataList"
                :maxHeight="maxHeight"
                :hover="fixedScrollOver"
                @on-toggle-select="toggleSelect"
            ></table-body>

            <table-foot
                v-if="sum"
                :onlyFixed="true"
                :cal-width="calWidth"
                :columns="tableColumns"
                :sum="sum"
            ></table-foot>
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

import { MIN_WIDTH } from './data';

export default {
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
        }
    },
    data(){
        return {
            dataList: this.initData(),
            style:{},
            calWidth: {},
            tableColumns: this.columns,
            headerH: 38,
            bodyH: 0,
            footH: 54,
            maxHeight: this.height,
            bodyScrolling: false,
            fixedBodyScrolling: false,
            scrollYScrolling: false,
            colResize: {
                onColResizing: false,
                originX: 0, // 记录拖动起点
                currentX: 0, // 拖动实时位置
                resizeIndex: -1, // 调整的表头 index
                minX: 0, // 可拖动调整最小值
            }
        }
    },
    computed: {
        hasFixed: function() {
            return this.tableColumns.some(item => item.fixed === 'left');
        },
        fixedLeftWidth: function() {
            return this.tableColumns.reduce((width, item) => {
                if (item.fixed === 'left') {
                    width += this.calWidth[item.key];
                }
                return width;
            }, 0);
        }
    },
    mounted(){
        this.resize();
        window.addEventListener('resize',this.resize);
        window.addEventListener('resize',this.calHeight);
        if (this.resizable) {
            window.addEventListener('mouseup', this.onColResizeEnd);
            this.$el.addEventListener('mousemove', this.onColResizeMove);
        }
    },
    watch: {
        data: {
            handler: function() {
                this.dataList = this.initData();
                this.resize();
                this.calHeight();
            },
            deep: true,
        },
        height: function(val){
            this.maxHeight = val;
        },
        columns: function(arr) {
            this.tableColumns = arr;
        },
        tableColumns: {
            handler: function(arr) {
                this.resize();
                this.calHeight();
                this.$emit('update:columns', arr);
            },
            deep: true
        },
        sum: function() {
            this.calHeight();
        }
    },
    updated() {},
    beforeDestroy() {
        window.removeEventListener('resize',this.resize);
        window.removeEventListener('resize',this.calHeight);
        window.removeEventListener('mouseup', this.onColResizeEnd);
        this.$el.removeEventListener('mousemove', this.onColResizeMove);
    },
    methods:{
        initData() {
            let list = [];
            list = this.data.map(item => {
                const newItem = JSON.parse(JSON.stringify(item));
                newItem._isChecked = !!newItem._checked;
                newItem._isDisabled = !!newItem._disabled;
                return newItem;
            });
            return list;
        },
        toggleSelect(index) {
            console.log('toggleSelect')
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
                const currentX = e.clientX - this.$el.getBoundingClientRect().left;
                const dX = currentX - colResize.originX;
                if (dX >= colResize.minX) { // 限制参考线最小值
                    colResize.currentX = currentX;
                }
            }
        },
        onColResizeEnd(e) {
            const colResize = this.colResize;
            if (colResize.onColResizing) {
                const dX = colResize.currentX - colResize.originX;
                const finalX = Math.max(this.tableColumns[colResize.resizeIndex].width + dX, MIN_WIDTH);
                this.tableColumns[colResize.resizeIndex].width = finalX;
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
                colResize.onColResizing = true;
                colResize.resizeIndex = index;
                colResize.originX = colResize.currentX = e.clientX - this.$el.getBoundingClientRect().left;
                colResize.minX = MIN_WIDTH - this.tableColumns[index].width;
            }
        },
        handleFixedBodyScroll(e) {
            if(this.bodyScrolling || this.scrollYScrolling) return;
            this.fixedBodyScrolling = true;
            const scrollTop = e.target.scrollTop;
            this.$refs.tableBody.$el.scrollTop = scrollTop;
            if(this.bodyH > this.maxHeight) this.$refs.scrollYBody.$refs.scrollYBody.scrollTop = scrollTop;
        },
        handleBodyScroll(e) {
            if(this.scrollYScrolling || this.fixedBodyScrolling) return;
            this.bodyScrolling = true;
            const scrollTop = e.target.scrollTop;
            if (this.hasFixed) this.$refs.fixedLeftBody.$el.scrollTop = scrollTop;
            if(this.bodyH > this.maxHeight) this.$refs.scrollYBody.$refs.scrollYBody.scrollTop = scrollTop;
        },
        handleScrollYScroll(e) {
            if(this.bodyScrolling || this.fixedBodyScrolling) return;
            this.scrollYScrolling = true;
            const scrollTop = e.target.scrollTop;
            this.$refs.tableBody.$el.scrollTop = scrollTop;
            if (this.hasFixed) this.$refs.fixedLeftBody.$el.scrollTop = scrollTop;
        },
        bodyScrollOver(){
            this.bodyScrolling = true;
            this.fixedBodyScrolling = false;
            this.scrollYScrolling = false;
        },
        fixedScrollOver(){
            this.bodyScrolling = false;
            this.fixedBodyScrolling = true;
            this.scrollYScrolling = false;
        },
        scrollScrollOver(){
            this.bodyScrolling = false;
            this.fixedBodyScrolling = false;
            this.scrollYScrolling = true;
        },
        onSortChange(item) {
            this.$emit('on-sort-change', item);
        },
        calHeight() {
            if (!this.height) { return; }
            // 在下次重绘后获取 offsetHeight
            requestAnimationFrame(() => {
                const $refs = this.$refs;
                const $tableFoot = $refs.tableFoot;
                const headerH = $refs.tableHeader.$el.offsetHeight;
                const bodyH = $refs.tableBody.$el.querySelector('.flex-table-tr').offsetHeight;
                const footH = $tableFoot ? $tableFoot.$el.offsetHeight : 0;
                this.headerH = headerH;
                this.footH = footH;
                this.bodyH = bodyH;
                this.maxHeight = this.height - headerH - footH;
            });
        },
        resize(){
            requestAnimationFrame(() => {
                // wrapper 宽度
                const nTableWidth = this.$el.offsetWidth-2;

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
                        oWidth[sKey] = nWidth-1;//1 -border width
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
                            oWidth[sKey] = nCalWidth -1 ;//1 -border width
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
        }
    }
}
</script>

