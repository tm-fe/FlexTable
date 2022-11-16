
<template>
    <div class="flex-table-headSum" :style="{ height: height }">
        <div class="flex-table-row">
            <div
                v-for="(item, index) in columns"
                :class="[{
                    'flex-table-col': true,
                }, cellClsName(item)]"
                :key="index"
                :style="[setCellStyle(item), handleHeadSumWidth(item)]"
            >
                <template v-if="shouldRender(item)">
                    <Expand
                        v-if="getRenderType(item) === 'render'"
                        :row="headSum"
                        :column="item"
                        :index="index"
                        :render="item.render"
                    ></Expand>

                    <TableSlot
                        v-else-if="getRenderType(item) === 'slot'"
                        :row="headSum"
                        :column="item"
                        :index="index"
                        type="headSum"
                        :owner="owner"
                    ></TableSlot>

                    <p v-else-if="getRenderType(item) === 'normal'">
                        {{ headSum[item.key] }}
                    </p>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
import Expand from './expand.js';
import Mixin from './mixin.js';
import TableSlot from './slot.js';

export default {
    mixins: [Mixin],
    components: { Expand, TableSlot },
    props: {
        columns: {
            type: Array,
            required: true,
        },
        headSum: {
            type: Object,
        },
        onlyFixed: {
            type: String,
            default: '',
        },
        rowHeight: {
            type: Number,
            default: 0,
        },
        // 最后固定在左侧的列
        lastFixedField: {
            type: String,
            default: '',
        },
    },
    computed: {
        height() {
            if (this.onlyFixed && this.rowHeight) {
                return `${this.rowHeight}px`;
            } else {
                return 'auto';
            }
        },
    },
    mounted() {
        this.$nextTick(() => {
            this.onRowHeightChange();
        });
    },
    updated() {
        this.$nextTick(() => {
            this.onRowHeightChange();
        });
    },
    methods: {
        onRowHeightChange() {
            if (!this.onlyFixed) {
                this.owner.onRowHeightChange({
                    rowIndex: 'headerSum',
                    height: this.$el.offsetHeight,
                });
            }
        },
        isHidden(item) {
            return this.onlyFixed && item.fixed !== this.onlyFixed;
        },
        shouldRender(item) {
            return !this.isHidden(item);
        },
        isInvisible(col) {
            // 非固定层的固定列应不可见
            return col.fixed && !this.onlyFixed;
        },
        getRenderType(item) {
            let renderType = 'normal';
            // renderType
            if (item.type === 'slot') {
                renderType = 'slot';
            } else if (item.render) {
                renderType = 'render';
            }

            return renderType;
        },
        handleHeadSumWidth(column) {
            const idx = this.columns.findIndex(
                (item) =>
                    item.key === column.key &&
                    column.fixed === 'left' &&
                    column.type !== 'selection'
            );
            if (idx > -1) {
                const beforeKey = JSON.parse(JSON.stringify(this.columns))
                    .splice(0, idx)
                    .map((item) => item.key);
                let num = 0;
                for (const item of beforeKey) {
                    num += this.calWidth[item];
                }
                return {
                    position: 'sticky',
                    background: '#f5f6f7',
                    zIndex: '20',
                    left: `${num}px`,
                };
            } else if (idx === -1 && !column.key) {
                return {
                    position: 'sticky',
                    left: '0px',
                    zIndex: '20',
                    background: '#f5f6f7'
                };
            }
        },
        flexTableBorder(item) {
            if (item.key === this.lastFixedField) {
                return 'fixedBorder';
            }
            return '';
        },
        cellClsName(item) {
            return [
                this.flexTableBorder(item),
            ];
        },
    },
};
</script>
<style lang="less" scoped>
.flex-table-headSum {
    border-bottom: 1px solid #eee;
    text-align: left;
    box-sizing: border-box;
    background: #f5f6f7;
    p {
        margin: 0;
    }
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
.notFixed{
    .fixedBorder:after{
        box-shadow: none;
    }
}
</style>
