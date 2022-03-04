<template>
    <div
        class="flex-table-body"
        :class="{ 'flex-table-fixed-header': maxHeight }"
        :style="style"
        @mouseleave="mouseleave"
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
                    :hoverIndex="hoverIndex"
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
            <div
                v-for="(row, index) in data"
                :key="row[uniqueKey] || row.id || index"
                :class="`${
                    isVirtualScroll
                        ? 'virtualItem bgColor'
                        : 'commonItem bgColor'
                }`"
                :style="{
                    transform: isVirtualScroll
                        ? `translateY(${row.top}px)`
                        : 'none',
                    height: isVirtualScroll ? `${virtualHeight}px` : 'auto',
                }"
            >
                <table-tr
                    v-bind="$props"
                    :key="index"
                    :row="row"
                    :rowIndex="index"
                    :columns="columns"
                    :cal-width="calWidth"
                    :onlyFixed="onlyFixed"
                    :rowHeight="
                        isVirtualScroll ? virtualHeight : rowHeight[index]
                    "
                    :hoverIndex="hoverIndex"
                    :selectedClass="selectedClass"
                    :spanMethod="spanMethod"
                    :rowSpanColumns="rowSpanColumns"
                    @on-toggle-select="toggleSelect"
                    @on-toggle-expand="toggleExpand"
                    @on-td-click="handleRowClick"
                    @doLayout="$emit('doLayout')"
                ></table-tr>
                <div
                    class="flex-table-expanded"
                    v-if="row._expanded"
                    :key="'expand_' + index"
                >
                    <Expand
                        :row="row"
                        :index="index"
                        :render="expandRender"
                    ></Expand>
                </div>
            </div>
        </div>

        <div v-else>
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
        hoverIndex: {
            type: Number | undefined,
            required: true,
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
    },
    computed: {
        style() {
            const tableSumHeight = this.$parent.$refs.tableSum
                ? this.$parent.$refs.tableSum.$el.offsetHeight
                : 0;
            if (this.virtualScroll) {
                return {
                    height: this.maxHeight
                        ? `${this.maxHeight + tableSumHeight}px`
                        : `auto`,
                };
            }

            return {
                'max-height': this.maxHeight
                    ? `${this.maxHeight - tableSumHeight}px`
                    : `auto`,
                'z-index': !this.data.length ? '10' : '0',
            };
        },
        defaultHeight() {
            return { height: `${this.virtualHeight}px` };
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
    updated() {
        this.$el.scrollTop = this.scrollTop;
    },
    methods: {
        toggleSelect(index, value) {
            this.$emit('on-toggle-select', index, value);
        },
        toggleExpand(index) {
            const row = this.data[index];
            if (!row._disableExpand) {
                this.data[index]._expanded = !this.data[index]._expanded;
            }
        },
        handleRowClick(index, row, column) {
            this.$emit('on-row-click', index, row, column);
        },
        mouseleave() {
            this.owner.updateHoverIndex();
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
                        const width = this.calWidth[column.key];
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
                width += this.calWidth[key];
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
    },
    mounted() {
        this.updateRowList();
    },
};
</script>
<style lang="less" scoped>
.bgColor {
    &:nth-child(odd) {
        background: #f9f9f9;
    }
}
.no-stripe {
    .virtualItem:nth-child(odd) {
        background: #fff;
    }
    .commonItem:nth-child(odd) {
        background: #fff;
    }
}
.commonItem:not(:last-child) {
    .flex-table-row {
        border-bottom: 1px solid #e9eaec;
    }
}
.virtualItem {
    overflow: hidden;
    position: absolute;
    left: 0;
    width: 100%;
    .flex-table-row {
        border-bottom: 1px solid #e9eaec;
    }
}
.flex-table-body .flex-table-tr > .flex-table-row {
    border-bottom: 0 !important;
}
</style>
