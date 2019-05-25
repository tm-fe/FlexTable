
<template>
    <div class="flex-table-foot">
        <div class="flex-table-row" :style="{ height: height }">
            <div 
                class="flex-table-col" 
                v-for="(item, index) in columns"
                :key="index"
                :class="{'flex-table-col-hidden': onlyFixed && (item.fixed !== onlyFixed)}"
                :style="setCellStyle(item)"
            >
                <template v-if="sum[item.key]">
                    <Expand
                        v-if="item.render"
                        :row="sum"
                        :column="item"
                        :index="index"
                        :render="item.render"></Expand>
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

export default {
    mixins: [ Mixin ],
    components: { Expand },
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
                this.$emit("on-row-height-change", {
                    rowIndex: 'footer',
                    height: this.$el.offsetHeight-1,
                });
            }
        }
    }
}
</script>
