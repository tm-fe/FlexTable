<template>
    <div
        ref="tableTd"
        class="flex-table-row"
        :style="{ minHeight: height }"
        @click="handleTdClick($event, row)"
    >
        <table-td
            v-for="(column, i) in columns"
            v-if="!rowSpan || (rowSpan && i === columnIndex)"
            :key="column.key"
            :column="column"
            :cal-width="calWidth"
            :row="row"
            :row-span="rowSpan"
            :rowSpanColumns="rowSpanColumns"
            :rowIndex="rowIndex"
            :onlyFixed="onlyFixed"
            :multiple="multiple"
            :vertical="vertical"
            :class="tdClassName(column, row)"
            :width-style="colsLeftStyleObj[column.type !== 'selection' ? column.key : '_selection_left']"
            :last-fixed-field="lastFixedField"
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
            default: 0,
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
        vertical: {
            type: Boolean,
            default: false,
        },
        // 最后固定在左侧的列
        lastFixedField: {
            type: String,
            default: '',
        },
        colsLeftStyle: {
            type: String,
            required: true,
        },
    },
    data() {
        return {};
    },
    computed: {
        colsLeftStyleObj(){
            return JSON.parse(this.colsLeftStyle);
        },

        height() {
            if (this.virtualScroll) {
                return `${this.virtualHeight}px`;
            }
            if ((this.onlyFixed || this.rowSpan) && this.rowHeight) {
                return `${this.rowHeight}px`;
            } else {
                return 'auto';
            }
        },
    },
    methods: {
        toggleSelect(index, event) {
            this.$emit('on-toggle-select', index, event);
        },
        toggleExpand() {
            this.$emit('on-toggle-expand', this.rowIndex);
        },
        handleTdClick($event, column, row) {
            this.$emit('on-td-click', this.rowIndex, row, column);
        },
        selectedCls(row) {
            return row._isChecked ? this.selectedClass : '';
        },
        tdClassName() {
            return [this.selectedCls(this.row)];
        },
    },
};
</script>
<style lang="less" scoped>
</style>