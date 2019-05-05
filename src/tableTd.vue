<template>
    <div
        class="flex-table-col"
        :class="{'flex-table-col-hidden': onlyFixed && (column.fixed !== 'left')}"
        :style="setCellStyle(column)"
        ref="cell">
        <template v-if="renderType === 'selection'">
            <Checkbox :value="row._isChecked" @on-change="toggleSelect" :disabled="row._isDisabled"></Checkbox>
        </template>
        <Expand
            v-else-if="renderType === 'render'"
            :row="row"
            :column="column"
            :index="rowIndex"
            :render="column.render"></Expand>

        <template
            v-else-if="renderType === 'normal'"
        >{{row[column.key]}}</template>

        <template
            v-else-if="renderType === 'html'"
        ><span v-html="row[column.key]"></span></template>
    </div>
</template>
<script>
import Expand from './expand.js';
import Mixin from './mixin.js';

export default {
    name: 'TableTd',
    components: { Expand },
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
            type: Boolean,
            default: false
        }
    },
    data(){
        return {
            renderType: 'normal',
        }
    },
    created(){
        // renderType
        if (this.column.type === 'selection') {
            this.renderType = 'selection';
        } else if(this.column.render){
            this.renderType = 'render';
        }else if(this.column.type === 'html'){
            this.renderType = 'html';
        }
    },
    methods: {
        toggleSelect() {
            this.$parent.$parent.$parent.toggleSelect(this.rowIndex);
        }
    }
}
</script>

