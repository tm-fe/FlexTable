<template>
    <div
        class="flex-table-body"
        :class="{ 'flex-table-fixed-header': maxHeight }"
        :style="style"
    >
        <template v-for="(item, index) in rowSpanList">
            <div
                :key="index"
                :class="`flex-table-tr flex-table-span ${
                    isVirtualScroll
                        ? 'virtualItem bgColor'
                        : 'commonItem bgColor'
                }`"
                :style="item.style"
            >
                <table-tr
                    row-span
                    :column-index="item.columnIndex"
                    :key="item.rowIndex"
                    :row="item.row"
                    :rowIndex="item.rowIndex"
                    :columns="columns"
                    :cal-width="calWidth"
                    :onlyFixed="onlyFixed"
                    :rowHeight="item.height"
                    :selectedClass="selectedClass"
                    :spanMethod="spanMethod"
                    @on-toggle-select="toggleSelect"
                    @on-toggle-expand="toggleExpand"
                    @doLayout="$emit('doLayout')"
                ></table-tr>
            </div>
        </template>

        <div
            class="flex-table-tr"
            v-if="data.length"
            :style="isVirtualScroll ? scrollerStyle : null"
        >
                <table-tr
                    v-for="(row, index) in data"
                    :key="row[uniqueKey] || row.id || index"
                    :class="getRowClass(row, index)"
                    :style="{
                        transform: isVirtualScroll
                            ? `translateY(${row.top}px)`
                            : 'none',
                        height: isVirtualScroll ? `${virtualHeight}px` : 'auto',
                    }"
                    :row="row"
                    :rowIndex="index"
                    :columns="columns"
                    :cal-width="calWidth"
                    :onlyFixed="onlyFixed"
                    :selectedClass="selectedClass"
                    :spanMethod="spanMethod"
                    :rowSpanColumns="rowSpanColumns"
                    :multiple="multiple"
                    :virtualScroll="virtualScroll"
                    :virtualHeight="virtualScroll"
                    :vertical="vertical"
                    :cols-left-style="colsLeftStyle"
                    :last-fixed-field="lastFixedField"
                    @on-toggle-select="toggleSelect"
                    @on-toggle-expand="toggleExpand"
                    @on-td-click="handleRowClick"
                    @doLayout="$emit('doLayout')"
                ></table-tr>
        </div>

        <div v-else class="noData">
            <div class="flex-table-col flex-table-tip">
                {{ !onlyFixed && !loading ? noData : '&nbsp;' }}
            </div>
        </div>
    </div>
</template>
<script>
import tableTr from './tableTr.vue';
import Mixin from './mixin.js';
import Expand from './expand.js';
const noop = function () {};
export default {
    name: 'TableBody',
    components: {
        tableTr,
        Expand,
    },
    mixins: [Mixin],
    props: {
        data: {
            type: Array,
        },
        columns: {
            type: Array,
        },
        headSum: {
            type: [Object, Boolean],
        },
        uniqueKey: {
            type: String,
            default: 'id',
        },
        height: {
            type: Number,
        },
        maxHeight: {
            type: Number,
        },
        onlyFixed: {
            type: String,
            default: '',
        },
        noData: {
            type: String,
            default: 'No Data',
        },
        rowHeight: {
            type: Object,
            default: () => ({}),
        },
        scrollTop: {
            type: Number,
            default: 0,
        },
        selectedClass: {
            type: String,
            default: '',
        },
        spanMethod: {
            type: Function,
        },
        virtualScroll: {
            type: Number,
        },
        virtualHeight: {
            type: Number,
            default: 40,
        },
        scrollerStyle: {
            type: Object,
        },
        multiple: {
            type: Boolean,
            default: true,
        },
        loading: {
            type: Boolean,
            default: false,
        },
        vertical: {
            type: Boolean,
            default: false,
        },
        colsLeftStyle: {
            type: String,
            required: true,
        },
        // 最后固定在左侧的列
        lastFixedField: {
            type: String,
            default: '',
        },
    },
    computed: {
        style() {
            if (this.virtualScroll) {
                return {
                    height: this.maxHeight
                        ? `${this.maxHeight}px`
                        : `auto`,
                };
            }

            return {
                'max-height': this.maxHeight
                    ? `${this.maxHeight}px`
                    : `auto`,
                'z-index': !this.data.length ? '7' : '0',
            };
        },
        expandRender() {
            let render = noop;
            if (this.owner.$scopedSlots.expand) {
                return (render = (h, params) =>
                    h('div', this.owner.$scopedSlots.expand(params)));
            }
            this.columns.some((obj) => {
                if (obj.type === 'expand') {
                    render = obj.render;
                    return true;
                }
            });
            return render;
        },
        isVirtualScroll() {
            return (
                !!this.virtualScroll & (this.virtualScroll < this.data.length)
            );
        },
    },
    watch: {
        scrollTop(scrollTop) {
            this.$el.scrollTop = scrollTop;
        },
        data(val) {
            this.updateRowList();
        },
    },
    data() {
        return {
            rowSpanList: [],
            rowSpanColumns: [],
        };
    },
    methods: {
        toggleSelect(index, event) {
            this.$emit('on-toggle-select', index, event);
        },
        toggleExpand(index) {
            const row = this.data[index];
            if (!row._disableExpand) {
                this.data[index]._expanded = !this.data[index]._expanded;
            }
        },
        handleRowClick(index, row) {
            this.$emit('on-row-click', index, row);
        },
        getRowSpan() {
            const list = [];
            if (!this.spanMethod) {
                return list;
            }
            this.data.forEach((row, rowIndex) => {
                this.columns.forEach((column, columnIndex) => {
                    const setting = this.spanMethod({
                        row,
                        column,
                        rowIndex,
                        columnIndex,
                    });
                    if (setting.rowspan > 1) {
                        const spanStart = rowIndex; // 开始位置
                        const spanEnd = rowIndex + setting.rowspan - 1; // 结束位置
                        // 记录进行合并的行
                        const spanColunmKey = `${column.key}||${spanStart}||${spanEnd}`;
                        if (!this.rowSpanColumns.includes(spanColunmKey)) {
                            this.rowSpanColumns.push(spanColunmKey);
                        }

                        const left = this.calRowWidth(0, columnIndex - 1);
                        const top = this.calColHeight(0, rowIndex - 1);
                        const height = this.calColHeight(spanStart, spanEnd);
                        const width = this.calWidthObj[column.key];
                        list.push({
                            columnIndex,
                            rowIndex,
                            row,
                            height,
                            style: `width:${width}px;left:${left}px;top:${top}px;`,
                        });
                    }
                });
            });

            this.rowSpanList = list;
            return list;
        },
        calRowWidth(start, end) {
            let width = 0;
            for (let i = start; i <= end; i++) {
                let key = this.columns[i].key;
                width += this.calWidthObj[key];
            }
            return width >= 0 ? width : 0;
        },
        calColHeight(start, end) {
            let height = 0;
            for (let i = start; i <= end; i++) {
                height += this.rowHeight[i];
            }
            return height >= 0 ? height : 0;
        },
        updateRowList() {
            this.$nextTick(() => {
                setTimeout(() => {
                    this.getRowSpan();
                }, 10);
            });
        },
        getRowClass(row, index) {
            let commonClass = this.isVirtualScroll ? 'virtualItem' : '';
            if (this.$parent.rowClassName && this.$parent.rowClassName(row, index)) {
                commonClass = `${commonClass} ${this.$parent.rowClassName(row, index)}`
            }
            return commonClass;
        },
    },
    mounted() {
        this.updateRowList();
    },
};
</script>
<style lang="less" scoped>
.virtualItem {
    overflow: hidden;
    position: absolute;
    left: 0;
    width: 100%;
    .flex-table-row {
        border-bottom: 1px solid #eee;
    }
}
.noData {
    position: sticky;
    width: 200px;
    bottom: -90px;
    left: 50%;
    transform: translateX(-50%);
}
</style>
