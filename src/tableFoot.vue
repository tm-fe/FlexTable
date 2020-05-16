
<template>
    <div class="flex-table-foot" :style="{ height: height }">
        <div class="flex-table-row">
            <div 
                :class="{
                    'flex-table-col': true,
                    'flex-table-hidden': isInvisible(item)
                    }" 
                v-for="(item, index) in columns"
                :key="index"
                :style="setCellStyle(item)"
            >
                <template v-if="shouldRender(item)">
                    <Expand
                        v-if="getRenderType(item) === 'render'"
                        :row="sum"
                        :column="item"
                        :index="index"
                        :render="item.render"></Expand>

                    <TableSlot
                        v-else-if="getRenderType(item) === 'slot'"
                        :row="sum"
                        :column="item"
                        :index="index"
                        type="foot"
                        :owner="owner"></TableSlot>

                    <p v-else>{{sum[item.key]}}</p>
                    <p class="foot-label">{{item.title}}</p>
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
    mixins: [ Mixin ],
    components: { Expand, TableSlot },
    props: {
        columns: {
            type: Array,
            required: true,
        },
        sum:{
            type: Object,
        },
        onlyFixed: {
            type: String,
            default: ''
        },
        rowHeight: {
            type: Number,
            default: 0,
        }
    },
    computed: {
        height() {
            if (this.onlyFixed && this.rowHeight) {
                return `${this.rowHeight}px`;
            } else {
                return 'auto';
            }
        }
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
                    rowIndex: 'footer',
                    height: this.$el.offsetHeight,
                });
            }
        },
        isHidden(item) {
            return this.onlyFixed && (item.fixed !== this.onlyFixed);
        },
        shouldRender(item) {
            return this.sum[item.key] !== undefined && !this.isHidden(item)
        },
        isInvisible(col) { // 非固定层的固定列应不可见
            return col.fixed && !this.onlyFixed;
        },
        getRenderType(item) {
            let renderType = 'normal';
            // renderType
            if (item.type === 'slot') {
                renderType = 'slot';
            } else if(item.render){
                renderType = 'render';
            }

            return renderType;
        }
    }
}
</script>
