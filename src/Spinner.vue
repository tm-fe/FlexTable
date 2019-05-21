<template>
    <div class="flex-table-spinner">
        <div class="flex-table-spinner-dot flex-table-spinner-dot-odd" v-bind:style="spinnerStyle">
        </div><div class="flex-table-spinner-dot flex-table-spinner-dot-even" v-bind:style="spinnerStyle">
        </div><div class="flex-table-spinner-dot flex-table-spinner-dot-odd" v-bind:style="spinnerStyle">
        </div>
    </div>
</template>
<script>
export default {
    name: "Spinner",
    data() {
        return {
            spinnerStyle: {
                backgroundColor: '#0b8df8',
                height: '15px',
                width: '15px',
                margin: '2px',
                borderRadius: '100%',
            }
        }
    }
}
</script>
<style lang="less">
.flex-table-spinner{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(255,255,255,.7);
    display: flex;
    align-items: center;
    justify-content: center;
}
.flex-table-spinner-dot {
    flex: 0 0 auto;
    -webkit-animation: v-beatStretchDelay 0.7s infinite linear;
            animation: v-beatStretchDelay 0.7s infinite linear;
    -webkit-animation-fill-mode: both;
	          animation-fill-mode: both;
    display: inline-block;         
}
.flex-table-spinner-dot-odd {
  animation-delay: 0s;
}
.flex-table-spinner-dot-even {
  animation-delay: 0.35s;
}
@-webkit-keyframes v-beatStretchDelay {
    50%
    {
        -webkit-transform: scale3d(0.75, 0.75, 1);
                transform: scale3d(0.75, 0.75, 1);
        -webkit-opacity: 0.2;             
                opacity: 0.2;
    }
    100%
    {
        -webkit-transform: scale3d(1, 1, 1);
                transform: scale3d(1, 1, 1);
        -webkit-opacity: 1;             
                opacity: 1;
    }
}
@keyframes v-beatStretchDelay {
    50%
    {
        -webkit-transform: scale3d(0.75, 0.75, 1);
                transform: scale3d(0.75, 0.75, 1);
        -webkit-opacity: 0.2;             
                opacity: 0.2;
    }
    100%
    {
        -webkit-transform: scale3d(1, 1, 1);
                transform: scale3d(1, 1, 1);
        -webkit-opacity: 1;             
                opacity: 1;
    }
}
</style>