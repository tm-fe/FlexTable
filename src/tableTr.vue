<template>
    <div class="flex-table-row" :class="{'flex-table-hover': isHover}" :style="{ 'height': height }" @mouseenter="mouseenter">
        <table-td
            v-for="(column, i) in columns"
            v-if="!rowSpan || (rowSpan && i=== columnIndex)"
            :key="column.key + '_'+ i + '_' + rowIndex"
            :column="column"
            :index="i"
            :cal-width="calWidth"
            :row="row"
            :row-span="rowSpan"
            :rowSpanColumns="rowSpanColumns"
            :rowIndex="rowIndex"
            :onlyFixed="onlyFixed"
            :class="tdClassName(column, row)"
            @on-toggle-select="toggleSelect"
            @on-toggle-expand="toggleExpand"
        ></table-td>
    </div>
</template>
<script>
import tableTd from './tableTd.vue';
import Mixin from './mixin.js';

export default {
    name: 'TableTr',
    components:{
        tableTd,
    },
    mixins: [Mixin],
    props: {
        className: {
            type: String | Object
        },
        row: {
            type: Object
        },
        rowIndex: {
            type: Number
        },
        columns: {
            type: Array
        },
        onlyFixed: {
            type: String
        },
        rowHeight: {
            type: Number,
        },
        hoverIndex: {
            type: Number | undefined
        },
        selectedClass: {
            type: String,
            default: ''
        },
        rowSpan: {
            type: Boolean,
            default: false
        },
        columnIndex: {
            type: Number,
            default: 0
        },
        spanMethod: {
            type: Function
        },
        rowSpanColumns: {
            type: Array,
            default: function() {
                return [];
            }
        }
    },
    mounted() {
        this.onRowHeightChange();
    },
    updated() {
        this.$nextTick(() => {
            this.onRowHeightChange();
        });
    },
    computed: {
        height() {
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
        toggleSelect(index) {
            this.$emit('on-toggle-select', index);
        },
        toggleExpand() {
            this.$emit('on-toggle-expand', this.rowIndex);
        },
        onRowHeightChange() {
            // 如果是fixed 或者是合并行，则不进行 rowHeight的更新
            if (!this.onlyFixed && !this.rowSpan) {
                this.owner.onRowHeightChange({
                    rowIndex: this.rowIndex,
                    height: this.$el.offsetHeight,
                })
            }
        },
        mouseenter() {
            this.owner.updateHoverIndex(this.rowIndex);
        },
        rowClsName(_index) {
            return this.$parent.$parent.rowClassName(this.row, _index);
        },
        selectedCls(row) {
            return row._isChecked ? this.selectedClass : ''
        },
        tdClassName() {
            return [
                this.selectedCls(this.row),
                this.rowClsName(this.rowIndex),
            ]
        },
    }
}
</script>
