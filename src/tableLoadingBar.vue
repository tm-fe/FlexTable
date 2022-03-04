
<template>
    <div v-if="isShow">
        <div class="flex-table-loadingBaBg" />
        <transition name="fade">
            <div class="flex-table-loadingBar" :style="loadingBarStyle">
                <div class="loadingBar" :style="style"></div>
            </div>
        </transition>
    </div>
</template>
<script>
import Mixin from './mixin.js';

export default {
    mixins: [Mixin],
    data() {
        return {
            width: '0',
            progressTimmer: null,
            isShow: false,
        };
    },
    props: {
        calWidth: 0,
        showLoadingBar: false,
        rowHeight: {
            type: Number,
            default: 0,
        },
        headHeight: {
            type: Number,
            default: 0,
        },
        loading: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        style() {
            return `width: ${this.width};`;
        },
        loadingBarStyle() {
            return `top: ${this.headHeight}px`;
        },
    },
    watch: {
        loading: {
            handler: function (val) {
                this.isShow = true;
                if (val) {
                    this.startLoad(0);
                } else {
                    clearTimeout(this.progressTimmer);
                    this.width = '100%';
                    setTimeout(() => {
                        this.isShow = false;
                    }, 300);
                }
            },
        },
    },
    methods: {
        startLoad(progress) {
            progress += this.SetRandomNum(progress);
            this.progressTimmer = setTimeout(() => {
                this.width = `${progress}%`;
                this.startLoad(progress);
            }, progress * 7);
        },
        SetRandomNum(progress) {
            let num = 0;
            if (progress < 60) {
                num = this.getRandomNum(5, 20);
            } else if (progress < 85) {
                num = this.getRandomNum(3, 8);
            } else if (progress < 95) {
                num = this.getRandomNum(0, 1);
            }
            return num;
        },
        getRandomNum(minNum, maxNum) {
            switch (arguments.length) {
                case 1:
                    return parseInt(Math.random() * minNum + 1, 10);
                    break;
                case 2:
                    return parseInt(
                        Math.random() * (maxNum - minNum + 1) + minNum,
                        10
                    );
                    break;
                default:
                    return 0;
                    break;
            }
        },
    },
    mounted() {},
    updated() {},
};
</script>
<style lang="less" scoped>
.flex-table-loadingBar {
    position: absolute;
    z-index: 1;
    width: 100%;
    .loadingBar {
        background-color: #39f;
        height: 2px;
        width: 0;
        transition: width 0.2s linear;
    }
}
.flex-table-loadingBaBg {
    position: absolute;
    z-index: 1;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(255, 255, 255, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    & > svg {
        animation: rotation 1s linear infinite;
    }
}
</style>
