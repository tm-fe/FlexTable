<template>
    <div class="flex-table-row" :class="{'flex-table-hover': isHover}" :style="{ 'height': height }" @mouseenter="mouseenter">
        <table-td
            v-for="(column, i) in filterSpanColumns"
            :key="column.key + '_'+ i + '_' + rowIndex"
            :column="column"
            :index="i"
            :calWidth="calWidth"
            :width="filteredWidth[i]"
            :row="row"
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
        spanMethod: {
            type: Function
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
            if (this.onlyFixed && this.rowHeight) {
                return `${this.rowHeight}px`;
            } else {
                return 'auto';
            }
        },
        isHover() {
            return this.hoverIndex === this.rowIndex;
        },
        colspanArr() {
            if (this.spanMethod) {
                const { row, columns, rowIndex, columnIndex } = this;
                const arraySpan = columns.map((column, columnIndex) => {
                    // { rowspan, colspan } || [rowspan, colspan]
                    const result = this.spanMethod({ row, column, rowIndex, columnIndex });
                    if (result instanceof Array) {
                        return result;
                    }
                    if (result === undefined) {
                        return [1, 1];
                    }
                    return [result.rowspan, result.colspan];
                });
                return arraySpan.map(arr => arr[1]);
            }
            return [];
        },
        filterSpanColumns() {
            const columns = [];
            if (this.colspanArr.length) {
                this.colspanArr.reduce((sum, colspanNum) => {
                    const col = this.columns[sum];
                    if (col) {
                        columns.push(col);
                    }
                    colspanNum = colspanNum || 1;
                    return sum + colspanNum;
                }, 0);
                return columns;
            }
            return this.columns;
        },
        filteredWidth() {
            const aWidth = [];
            if (this.colspanArr.length) {
                this.colspanArr.reduce((sum, colspanNum) => {
                    let width = 0;
                    colspanNum = colspanNum || 1;
                    for (;colspanNum >= 1;colspanNum--) {
                        const col = this.columns[sum++];
                        if (col) {
                            width += this.calWidth[col.key];
                        }
                    }
                    aWidth.push(width);
                    return sum;
                }, 0);
                return aWidth;
            }
            return this.columns.map(col => this.calWidth[col.key]);
        }
    },
    methods: {
        toggleSelect(index) {
            this.$emit('on-toggle-select', index);
        },
        toggleExpand() {
            this.$emit('on-toggle-expand', this.rowIndex);
        },
        onRowHeightChange() {
            if (!this.onlyFixed) {
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
        }
    }
}
</script>
