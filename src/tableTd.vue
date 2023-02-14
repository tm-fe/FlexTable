<template>
    <div
        :class="[cellClsName(column, row), 'tableCol']"
        :style="[setCellStyle(column), widthStyle]"
        @click="onToggleExpand"
        ref="cell"
    >
        <template v-if="!isHidden">
            <div>
                <template v-if="renderType === 'selection'">
                    <Checkbox
                        v-if="multiple"
                        :checked="row._isChecked"
                        @click.native.prevent="toggleSelect"
                        :disabled="row._isDisabled"
                    ></Checkbox>
                    <Radio
                        v-else
                        :checked="row._isChecked"
                        @click.native.prevent="toggleSelect"
                        :disabled="row._isDisabled"
                    ></Radio>
                </template>
                <template v-if="renderType === 'expand'">
                    <i
                        :class="{
                            'flex-table-arrow-right': !expandOpen,
                            'flex-table-arrow-down': expandOpen,
                        }"
                    ></i>
                </template>
                <Expand
                    v-else-if="renderType === 'render'"
                    :row="row"
                    :column="column"
                    :index="rowIndex"
                    :render="column.render"
                ></Expand>
                <TableSlot
                    v-else-if="renderType === 'slot'"
                    :row="row"
                    :column="column"
                    :index="rowIndex"
                    :owner="owner"
                ></TableSlot>

                <template v-else-if="renderType === 'normal'">{{
                    row[column.key]
                }}</template>

                <template v-else-if="renderType === 'html'"
                    ><span v-html="row[column.key]"></span
                ></template>
            </div>
        </template>
    </div>
</template>
<script>
import { Checkbox, Radio } from 'vue-checkbox-radio';
import Expand from './expand.js';
import Mixin from './mixin.js';
import TableSlot from './slot.js';

export default {
    name: 'TableTd',
    components: { Expand, Checkbox, Radio, TableSlot },
    mixins: [Mixin],
    props: {
        column: {
            type: Object,
            required: true,
        },
        row: {
            type: Object,
            required: true,
        },
        rowIndex: {
            type: Number,
        },
        onlyFixed: {
            type: String,
            default: '',
        },
        rowSpan: {
            type: Boolean,
            default: false,
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
        vertical: {
            type: Boolean,
            default: false,
        },
        widthStyle: {
            type: Object,
            default: () => ({}),
        },
        // 最后固定在左侧的列
        lastFixedField: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            renderType: 'normal',
            expandOpen: this.row._expanded,
        };
    },
    watch: {
        'row._expanded'(val) {
            this.expandOpen = val;
        },
    },
    computed: {
        isHidden() {
            let hasSpan = false;

            // 如果不是合并行的div
            if (!this.rowSpan) {
                hasSpan = this.checkIsInRowSpan();
            }

            // 固定层的非固定列和需要合并行的列  无需渲染
            return (
                (this.onlyFixed && this.column.fixed !== this.onlyFixed) ||
                hasSpan
            );
        },
        isInvisible() {
            // 非固定层的固定列应不可见
            return this.column.fixed && !this.onlyFixed;
        },
    },
    created() {
        // renderType
        if (this.column.type === 'selection') {
            this.renderType = 'selection';
        } else if (this.column.type === 'expand') {
            this.renderType = 'expand';
        } else if (this.column.type === 'slot') {
            this.renderType = 'slot';
        } else if (this.column.type === 'html') {
            this.renderType = 'html';
        } else if (this.column.render) {
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
                if (
                    splitRes[0] === columnKey &&
                    rowIndex >= splitRes[1] &&
                    rowIndex <= splitRes[2]
                ) {
                    flag = true;
                }
            });
            return flag;
        },
        toggleSelect(e) {
            // 阻止影响行点击事件
            e.preventDefault();
            e.stopPropagation();
            this.$emit('on-toggle-select', this.rowIndex, e);
        },
        onToggleExpand() {
            if (this.renderType !== 'expand') {
                return;
            }
            this.expandOpen = !this.expandOpen;
            this.$emit('on-toggle-expand');
        },
        flexTableCol() {
            return 'flex-table-col';
        },
        flexTableColIcon() {
            return this.renderType === 'expand' ? 'flex-table-col-icon' : '';
        },
        flexTableExpandDisabled() {
            return this.renderType === 'expand' && this.row._disableExpand
                ? 'flex-table-expand-disabled'
                : '';
        },
        flexTableHidden() {
            return this.isInvisible ? 'flex-table-hidden' : '';
        },
        flexTableBorder() {
            if (this.lastFixedField === this.column.key) {
                return 'fixedBorder';
            }
            return '';
        },
        cellClsName(column, row) {
            return [
                this.flexTableCol(),
                this.flexTableColIcon(),
                this.flexTableExpandDisabled(),
                this.flexTableHidden(),
                this.alignCls(column, row),
                this.flexTableBorder(),
            ];
        },
    },
};
</script>
<style scoped lang="less">
/deep/ .input-box {
    position: relative;
    border: 1px solid #ccc !important;
    box-shadow: none !important;
}
/deep/ .radio-component > input:checked + label > .input-box {
    border: 1px solid #3475ff !important;
}
/deep/ .input-box-circle {
    width: 8px !important;
    height: 8px !important;
    position: absolute !important;
    top: 50%;
    margin-top: -4px !important;
    left: 50%;
    margin-left: -4px !important;
    background: #3475ff !important;
}
/deep/ .radio-component > input:disabled + label > .input-box {
    background: #f7f7f7;
    cursor: not-allowed;
}
.fixedBorder:after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: -1px;
    width: 30px;
    transform: translate(100%);
    transition: box-shadow .3s;
    content: "";
    pointer-events: none;
    box-shadow: inset 10px 0 8px -5px #00000026;
}
.notFixed {
    .fixedBorder:after {
        box-shadow: none;
    }
}
</style>