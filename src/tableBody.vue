<template>
    <div
        class="flex-table-body"
        @scroll="scroll"
        @mouseover="hover"
        :class="{'flex-table-fixed-header': maxHeight}"
        :style="style">
        <div v-if="data.length">
            <template v-for="(row, index) in data">
                <table-tr
                    :key="index"
                    :row="row"
                    :rowIndex="index"
                    :columns="columns"
                    :cal-width="calWidth"
                    :onlyFixed="onlyFixed"
                    @on-toggle-select="toggleSelect"
                    @on-toggle-expand="toggleExpand"
                ></table-tr>
                <div class="flex-table-row" v-if="row._expanded" :key="'expand_'+index">
                    <Expand
                        :row="row"
                        :index="index"
                        :render="expandRender"></Expand>
                </div>
            </template>
        </div>
        <div v-else>
            <div class="flex-table-col flex-table-tip">{{!onlyFixed ? noData : '&nbsp;'}}</div>
        </div>
    </div>
</template>
<script>
import tableTr from './tableTr.vue';
import Mixin from './mixin.js';
import Expand from './expand.js';
const noop = function () {};
export default {
    name: 'TableBody',
    components:{
        tableTr,
        Expand
    },
    mixins: [Mixin],
    props: {
        data: {
            type: Array
        },
        columns: {
            type: Array
        },
        maxHeight: {
            type: Number
        },
        scroll: {
            type: Function,
            default: function() {
                return noop;
            }
        },
        hover: {
            type: Function,
            default: function() {
                return noop;
            }
        },
        onlyFixed: {
            type: Boolean,
            default: false
        },
        noData: {
            type: String,
            default: 'No Data'
        }
    },
    computed: {
        style() {
            return {'max-height': this.maxHeight ? `${this.maxHeight}px` : `auto`};
        },
        expandRender() {
            let render = noop;
            this.columns.some(obj => {
                if (obj.type === 'expand') {
                    render = obj.render;
                    return true;
                }
            });
            return render;
        }
    },
    data(){
        return {

        };
    },
    methods: {
        toggleSelect(index) {
            this.$emit('on-toggle-select', index);
        },
        toggleExpand(index) {
            const row = this.data[index];
            if (!row._disableExpand) {
                this.data[index]._expanded = !this.data[index]._expanded;
            }
        }
    }
}
</script>

