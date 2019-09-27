<template>
    <div class="flex-table-scroll-y">
        <div class="flex-table-scroll-y-head" :style="{'height': `${headerH}px`}"></div>
        <div
            class="flex-table-scroll-y-body"
            :style="{'height': `${maxHeight}px`}"
            ref="scrollYBody"
            @scroll="scroll"
        >
            <div :style="{'height': `${bodyH}px`}"></div>
        </div>
        <div class="flex-table-scroll-y-foot" v-if="sum"></div>
    </div>
</template>
<script>
export default {
    props: {
        bodyH: {
            type: Number
        },
        headerH: {
            type: Number
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
        sum: {
            type: Boolean
        },
        scrollTop: {
            type: Number,
            default: 0
        }
    },
    watch: {
        scrollTop(scrollTop) {
            this.$refs.scrollYBody.scrollTop = scrollTop;
        }
    }
};
</script>
