<template>
    <div class="flex-table-row">
        <table-td
            v-for="(column, i) in columns"
            :key="column.key + '_'+ i + '_' + rowIndex"
            :column="column"
            :index="i"
            :cal-width="calWidth"
            :row="row"
            :rowIndex="rowIndex"
            :onlyFixed="onlyFixed"
            @on-toggle-select="toggleSelect"
            @on-toggle-expand="toggleExpand"
        ></table-td>
    </div>
</template>
<script>
import tableTd from './tableTd.vue';
import Mixin from './mixin.js';

export default {
    name: 'TableTr',
    components:{
        tableTd,
    },
    mixins: [Mixin],
    props: {
        row: {
            type: Object
        },
        rowIndex: {
            type: Number
        },
        columns: {
            type: Array
        },
        onlyFixed: {
            type: String
        }
    },
    methods: {
        toggleSelect(index) {
            this.$emit('on-toggle-select', index);
        },
        toggleExpand() {
            this.$emit('on-toggle-expand', this.rowIndex);
        }
    }
}
</script>
