<template>
    <div
        :class="cellClsName(column, row)"
        :style="setCellStyle(column)"
        @click="onToggleExpand"
        ref="cell">
        <template v-if="!isHidden">
            <template v-if="renderType === 'selection'">
                <Checkbox :checked="row._isChecked" @input="toggleSelect" :disabled="row._isDisabled"></Checkbox>
            </template>
            <template v-if="renderType === 'expand'">
                <i :class="{
                    'flex-table-arrow-right': !expandOpen,
                    'flex-table-arrow-down': expandOpen,
                    }"></i>
            </template>
            <Expand
                v-else-if="renderType === 'render'"
                :row="row"
                :column="column"
                :index="rowIndex"
                :render="column.render"></Expand>
            <TableSlot
                v-else-if="renderType === 'slot'"
                :row="row"
                :column="column"
                :index="rowIndex"
                :owner="owner"></TableSlot>

            <template
                v-else-if="renderType === 'normal'"
            >{{row[column.key]}}</template>

            <template
                v-else-if="renderType === 'html'"
            ><span v-html="row[column.key]"></span></template>
        </template>
    </div>
</template>
<script>
import { Checkbox } from 'vue-checkbox-radio';
import Expand from './expand.js';
import Mixin from './mixin.js';
import TableSlot from './slot.js';

export default {
    name: 'TableTd',
    components: { Expand, Checkbox, TableSlot },
    mixins: [Mixin],
    props:{
        column: {
            type: Object,
            required: true,
        },
        index: {
            type: Number,
            required: true,
        },
        row: {
            type: Object,
            required: true,
        },
        rowIndex: {
            type: Number
        },
        onlyFixed: {
            type: String,
            default: ''
        },
        rowSpan: {
            type: Boolean,
            default: false
        },
        rowSpanColumns: {
            type: Array,
            default: function() {
                return [];
            }
        }
    },
    data(){
        return {
            renderType: 'normal',
            expandOpen: this.row._expanded,
        }
    },
    watch: {
        'row._expanded'(val) {
            this.expandOpen = val;
        }
    },
    computed: {
        isHidden() {
            let hasSpan = false;

            // 如果不是合并行的div 
            if (!this.rowSpan) {
                hasSpan = this.checkIsInRowSpan();
            }
            
            // 固定层的非固定列和需要合并行的列  无需渲染
            return (this.onlyFixed && (this.column.fixed !== this.onlyFixed)) || hasSpan;
        },
        isInvisible() { // 非固定层的固定列应不可见
            return this.column.fixed && !this.onlyFixed;
        }
    },
    created(){
        // renderType
        if (this.column.type === 'selection') {
            this.renderType = 'selection';
        } else if(this.column.type === 'expand'){
            this.renderType = 'expand';
        } else if (this.column.type === 'slot') {
            this.renderType = 'slot';
        } else if(this.column.type === 'html'){
            this.renderType = 'html';
        } else if(this.column.render){
            this.renderType = 'render';
        }
    },
    methods: {
        /**
         * 检测是否在合并的行里面
         */
        checkIsInRowSpan() {
            const columnKey = this.column.key;
            const rowIndex = this.rowIndex;
            let flag = false;
            this.rowSpanColumns.forEach((text) => {
                const splitRes = text.split('||');
                // 如果key匹配上, 范围符合
                if (splitRes[0] === columnKey && rowIndex >= splitRes[1] && rowIndex <= splitRes[2]) {
                    flag = true;
                }
            });
            return flag;
        },
        toggleSelect() {
            this.$emit('on-toggle-select', this.rowIndex);
        },
        onToggleExpand() {
            if (this.renderType !== 'expand') { return; }
            this.expandOpen = !this.expandOpen;
            this.$emit('on-toggle-expand');
        },
        flexTableCol() {
            return 'flex-table-col'
        },
        flexTableColIcon() {
            return this.renderType === 'expand' ? 'flex-table-col-icon' : ''
        },
        flexTableExpandDisabled() {
            return (this.renderType === 'expand' && this.row._disableExpand)
                ? 'flex-table-expand-disabled' : ''
        },
        flexTableHidden() {
            return this.isInvisible ? 'flex-table-hidden' : ''
        },
        cellClsName(column, row) {
            return [
                this.flexTableCol(),
                this.flexTableColIcon(),
                this.flexTableExpandDisabled(),
                this.flexTableHidden(),
                this.alignCls(column, row),
            ]
        },
    }
}
</script>

