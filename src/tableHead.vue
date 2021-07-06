<template>
    <div class="flex-table-head" :style="{ height: height }">
        <div class="flex-table-row">
            <div
                v-for="(item, index) in headRow"
                :key="item.key + '_' + index"
                :class="{
                    'flex-table-col': true,
                    'flex-table-hidden': isInvisible(item),
                }"
                :style="setCellStyle(item)"
            >
                <template v-if="!isHidden(item)">
                    <template v-if="item.type === 'selection' && multiple">
                        <Checkbox
                            v-model="isChecked"
                            :disabled="!data.length || !isRenderDone || isAllDisabled"
                            @input="selectAll"
                        ></Checkbox>
                        <slot v-if="$slots['batchCheck']" name="batchCheck"/>
                    </template>
                    <template v-else>
                        <Expand
                            v-if="item.renderHeader"
                            :column="item"
                            :index="index"
                            :render="item.renderHeader"
                        ></Expand>
                        <span v-else>{{ item.title }}</span>
                        <span class="flex-table-sort" v-if="item.sortable">
                            <i
                                @click="handleSort(index, 'asc')"
                                :class="{
                                    on: getColumns(index)._sort === 'asc',
                                }"
                                class="flex-table-arrow-dropup"
                            ></i>
                            <i
                                @click="handleSort(index, 'desc')"
                                :class="{
                                    on: getColumns(index)._sort === 'desc',
                                }"
                                class="flex-table-arrow-dropdown"
                            ></i>
                        </span>
                        <div
                            v-if="isColResizable(item)"
                            @mousedown="onColResize($event, index)"
                            class="flex-table-col-resize j-col-resize"
                        ></div>
                    </template>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
import { Checkbox } from 'vue-checkbox-radio';
import Mixin from './mixin.js';
import Expand from './expand.js';

export default {
    name: 'TableHead',
    components: { Expand, Checkbox },
    mixins: [Mixin],
    props: {
        data: {
            type: Array,
        },
        allData: {
            type: Array,
            default() {
                return [];
            },
        },
        columns: {
            type: Array,
        },
        onlyFixed: {
            type: String,
            default: '',
        },
        resizable: Boolean,
        rowHeight: {
            type: Number,
            default: 0,
        },
        isRenderDone: {
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
        multiple: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            headRow: this.columns.map((item) => {
                item._sort = item.sortType || 'normal'; // 可选值 'desc','asc','normal'
                return item;
            }),
            isChecked: false, // 是否全选
        };
    },
    computed: {
        height() {
            if (this.onlyFixed && this.rowHeight) {
                return `${this.rowHeight}px`;
            } else {
                return 'auto';
            }
        },
        isAllDisabled() {
            return this.data.length && this.data.every(item => item._disabled);
        }
    },
    watch: {
        columns: function (val) {
            this.headRow = val.map((item) => {
                item._sort = item.sortType || 'normal';
                return item;
            });
        },
        data: {
            handler(val) {
                const isChecked = val.length && val.filter(item => !item._disabled).every(item => item._isChecked);
                this.handleChangeStatus(isChecked);
                if(!val.length){
                    this.handleChangeStatus(false);
                }
            },
            deep: true,
        },
        allData: {
            handler(val) {
                if (this.virtualScroll) {
                    const isChecked = val.length && val.filter(item => !item._disabled).every((item) => item._isChecked);
                    this.handleChangeStatus(isChecked);
                }
            },
            deep: true,
        },
    },
    mounted() {
        this.onRowHeightChange();
    },
    updated() {
        this.$nextTick(() => {
            this.onRowHeightChange();
        });
    },
    methods: {
        isColResizable(col) {
            return this.resizable && col.resizable !== false;
        },
        selectAll(status) {
            this.$emit('on-select-all', this.isChecked);
        },
        onColResize(e, index) {
            this.$emit('on-col-resize', e, index);
        },
        handleSort(index, type) {
            this.headRow = this.headRow.map((item, i) => {
                if (index === i) {
                    item._sort = item._sort == type ? 'normal' : type;
                } else {
                    item._sort = 'normal';
                }
                return item;
            });
            const item = this.headRow[index];
            this.$emit('on-sort-change', {
                order: item._sort,
                key: item.key,
                row: item,
            });
        },
        getColumns(index) {
            return this.headRow[index];
        },
        onRowHeightChange() {
            if (!this.onlyFixed) {
                this.owner.onRowHeightChange({
                    rowIndex: 'header',
                    height: this.$el.offsetHeight,
                });
            }
        },
        isHidden(item) {
            return this.onlyFixed && item.fixed !== this.onlyFixed;
        },
        isInvisible(col) {
            // 非固定层的固定列应不可见
            return col.fixed && !this.onlyFixed;
        },
        handleChangeStatus(status) {
            // 控制是否全选
            this.isChecked = status;
        },
    },
};
</script>

