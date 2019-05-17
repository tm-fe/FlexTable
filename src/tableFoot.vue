
<template>
    <div class="flex-table-foot">
        <div class="flex-table-row">
            <div 
                class="flex-table-col" 
                v-for="(item, index) in columns"
                :key="index"
                :class="{'flex-table-col-hidden': isHidden(item)}"
                :style="setCellStyle(item)"
            >
                <template v-if="sum[item.key] && !isHidden(item)">
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
            type: Boolean,
            default: false
        }
    },
    methods: {
        isHidden(item) {
            return this.onlyFixed && (item.fixed !== 'left');
        }
    }
}
</script>
