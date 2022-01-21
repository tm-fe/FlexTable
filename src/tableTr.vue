<template>
    <!-- :ref="`${!onlyFixed ? 'tableTd' : ''}`" -->
    <div
        ref="tableTd"
        class="flex-table-row"
        :class="{ 'flex-table-hover': isHover }"
        :style="{ height: height }"
        @mouseenter="mouseenter"
    >
        <table-td
            v-bind="$props"
            v-for="(column, i) in columns"
            v-if="!rowSpan || (rowSpan && i === columnIndex)"
            :key="column.key + '_' + i + '_' + rowIndex"
            :column="column"
            :index="i"
            :cal-width="calWidth"
            :row="row"
            :row-span="rowSpan"
            :rowSpanColumns="rowSpanColumns"
            :rowIndex="rowIndex"
            :onlyFixed="onlyFixed"
            :class="tdClassName(column, row)"
            @click.native="handleTdClick($event, column, row)"
            @on-toggle-select="toggleSelect"
            @on-toggle-expand="toggleExpand"
            @load="handleLoad"
        ></table-td>
    </div>
</template>
<script>
import tableTd from './tableTd.vue';
import Mixin from './mixin.js';

export default {
    name: 'TableTr',
    components: {
        tableTd,
    },
    mixins: [Mixin],
    props: {
        className: {
            type: String | Object,
        },
        row: {
            type: Object,
        },
        rowIndex: {
            type: Number,
        },
        columns: {
            type: Array,
        },
        onlyFixed: {
            type: String,
        },
        rowHeight: {
            type: Number,
        },
        hoverIndex: {
            type: Number | undefined,
        },
        selectedClass: {
            type: String,
            default: '',
        },
        rowSpan: {
            type: Boolean,
            default: false,
        },
        columnIndex: {
            type: Number,
            default: 0,
        },
        spanMethod: {
            type: Function,
        },
        rowSpanColumns: {
            type: Array,
            default: function () {
                return [];
            },
        },
        multiple: {
            type: Boolean,
            default: true,
        },
        virtualScroll: {
            type: Number,
        },
        virtualHeight: {
            type: Number,
            default: 40,
        },
    },
    mounted() {
        const selt = this;
        if (this.$refs.tableTd) {
            let initHeight = document.body.clientHeight;
            let target = this.$refs.tableTd;
            // 创建观察者对象
            let observer = new ResizeObserver(function (mutations) {
                selt.$forceUpdate();
                selt.$emit('doLayout')
            });
            // 配置观察选项:
            let config = {
                attributes: true,
            };
            // 传入目标节点和观察选项
            observer.observe(target);
        }
        this.$nextTick(() => {
            this.onRowHeightChange();
        });
    },
    updated() {
        this.$nextTick(() => {
            this.onRowHeightChange();
        });
    },
    computed: {
        isVirtualScroll() {
            return this.virtualScroll;
        },
        height() {
            if (this.isVirtualScroll) {
                return `${this.virtualHeight}px`;
            }
            if ((this.onlyFixed || this.rowSpan) && this.rowHeight) {
                return `${this.rowHeight}px`;
            } else {
                return 'auto';
            }
        },
        isHover() {
            return this.hoverIndex === this.rowIndex;
        },
    },
    methods: {
        toggleSelect(index, value) {
            this.$emit('on-toggle-select', index, value);
        },
        toggleExpand() {
            this.$emit('on-toggle-expand', this.rowIndex);
        },
        handleTdClick($event, column, row) {
            if(column.type == 'selection' && ['checkbox', 'radio'].includes($event.target.type)) {
                this.$emit('on-selection-click', this.rowIndex, row); 
                return;
            } else if(column.type == 'selection') {
                const _checked = row._isChecked;
                setTimeout(() => {
                    if(_checked === row._isChecked) {
                        this.$emit('on-td-click', this.rowIndex, row, column);  
                    }
                })
                return;
            }
            this.$emit('on-td-click', this.rowIndex, row, column); 
        },
        onRowHeightChange() {
            // 如果是fixed 或者是合并行，则不进行 rowHeight的更新
            if (!this.rowSpan) {
                let { height } = this.$el.getBoundingClientRect();
                this.owner.onRowHeightChange({
                    rowIndex: this.rowIndex,
                    height,
                });
            }
        },
        debounce(fn, wait) {
            let timer = null;
            return function () {
                if (timer !== null) {
                    clearTimeout(timer);
                }
                timer = setTimeout(fn, wait);
            };
        },
        mouseenter() {
            this.debounce(this.owner.updateHoverIndex(this.rowIndex), 200);
        },
        rowClsName(_index) {
            return this.$parent.$parent.rowClassName(this.row, _index);
        },
        selectedCls(row) {
            return row._isChecked ? this.selectedClass : '';
        },
        tdClassName() {
            return [this.selectedCls(this.row), this.rowClsName(this.rowIndex)];
        },
        handleLoad() {
            this.mouseenter();
        },
    },
};
</script>
<style lang="less" scoped>
.flex-table-hover {
    background-color: #ebf7ff;
}
</style>