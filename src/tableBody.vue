<template>
    <div
        class="flex-table-body"
        @scroll="scroll"
        @mouseover="hover"
        :class="{'flex-table-fixed-header': maxHeight}"
        :style="{'max-height': `${maxHeight}px`}">
        <div class="flex-table-tr" v-if="data.length">
            <table-tr
                v-for="(row, index) in data"
                :key="index"
                :row="row"
                :rowIndex="index"
                :columns="columns"
                :cal-width="calWidth"
                :onlyFixed="onlyFixed"
            ></table-tr>
        </div>
        <div v-else class="flex-table-tr" >
            <div class="flex-table-col flex-table-tip">{{!onlyFixed ? noData : '&nbsp;'}}</div>
        </div>
    </div>
</template>
<script>
import tableTr from './tableTr.vue';
import Mixin from './mixin.js';
const noop = function () {};
export default {
    name: 'TableBody',
    components:{
        tableTr
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
    data(){
        return {

        };
    }
}
</script>

