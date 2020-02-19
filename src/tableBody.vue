<template>
    <div
        class="flex-table-body"
        :class="{'flex-table-fixed-header': maxHeight}"
        :style="style"
        @mouseleave="mouseleave"
        >
        <div class="flex-table-tr" v-if="data.length">
            <template v-for="(row, index) in data">
                <table-tr
                    :key="index"
                    :row="row"
                    :rowIndex="index"
                    :columns="columns"
                    :cal-width="calWidth"
                    :onlyFixed="onlyFixed"
                    :rowHeight="rowHeight[index]"
                    :hoverIndex="hoverIndex"
                    :selectedClass="selectedClass"
                    :spanMethod="spanMethod"
                    @on-toggle-select="toggleSelect"
                    @on-toggle-expand="toggleExpand"
                ></table-tr>
                <div class="flex-table-expanded" v-if="row._expanded" :key="'expand_'+index">
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
        onlyFixed: {
            type: String,
            default: ''
        },
        noData: {
            type: String,
            default: 'No Data'
        },
        rowHeight: {
            type: Object,
            default: () => ({}),
        },
        scrollTop: {
            type: Number,
            default: 0
        },
        hoverIndex: {
            type: Number | undefined,
            required: true
        },
        selectedClass: {
            type: String,
            default: '',
        },
        spanMethod: {
            type: Function
        }
    },
    computed: {
        style() {
            return {'max-height': this.maxHeight ? `${this.maxHeight}px` : `auto`};
        },
        expandRender() {
            let render = noop;
            if (this.owner.$scopedSlots.expand) {
                return render = (h, params) => h('div', this.owner.$scopedSlots.expand(params));
            }
            this.columns.some(obj => {
                if (obj.type === 'expand') {
                    render = obj.render;
                    return true;
                }
            });
            return render;
        }
    },
    watch: {
        scrollTop(scrollTop) {
            this.$el.scrollTop = scrollTop;
        }
    },
    data(){
        return {};
    },
    updated() {
        this.$el.scrollTop = this.scrollTop;
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
        },
        mouseleave() {
            this.owner.updateHoverIndex();
        }
    }
}
</script>

