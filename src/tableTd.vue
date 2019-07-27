<template>
    <div
        :class="{
            'flex-table-col': true,
            'flex-table-col-icon': renderType === 'expand',
            'flex-table-expand-disabled': renderType === 'expand' && row._disableExpand,
            }"
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
            return this.onlyFixed && (this.column.fixed !== this.onlyFixed);
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
        toggleSelect() {
            this.$emit('on-toggle-select', this.rowIndex);
        },
        onToggleExpand() {
            if (this.renderType !== 'expand') { return; }
            this.expandOpen = !this.expandOpen;
            this.$emit('on-toggle-expand');
        }
    }
}
</script>

