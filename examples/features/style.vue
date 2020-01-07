<template>
<div>
    <h3>风格样式</h3>
    <p>风格样式展示 <a href="https://github.com/tm-fe/FlexTable/blob/master/examples/features/style.vue">source code</a></p>
    <div class="btn-box">
        <button @click="size = ''" :disabled="size === ''">Default</button>
        <button @click="size = 'big'" :disabled="size === 'big'">Big</button>
        <button @click="size = 'small'" :disabled="size === 'small'">Small</button>
        <button @click="theme = ''" :disabled="theme === ''">Light</button>
        <button @click="theme = 'dark'" :disabled="theme === 'dark'">Dark</button>
        <button @click="isBorder = !isBorder">{{isBorder?'None Border':'Has Border'}}</button>
        <button @click="stripe = !stripe">{{stripe?'None Stripe':'Has Stripe'}}</button>
    </div>
    <div :class="theme === 'dark'?'table dark':'table'">
        <flex-table
            resizable
            :loading="loading" 
            :columns="columns" 
            :data="list"
            :sum="sum"
            :size="size"
            :theme="theme"
            :border="isBorder"
            :stripe="stripe"
        ></flex-table>
    </div>
</div>
</template>
<script>
// import flexTable from '../../index.js';

const aTestList = [];
for(let i=0;i<10;i++){
    const oTestData = {
        name: 'John Brown',
        age: 18,
        address: 'New York No. 1 Lake Park',
        date: '2016-10-03',
    };
    aTestList.push(oTestData);
}

export default {
    // components:{
    //     flexTable
    // },
    data(){
        return {
            columns: [
                {
                    title: 'Name',
                    key: 'name',
                },
                {
                    title: 'Age',
                    key: 'age',
                    render(h, params){
                        return h('span', 'age: '+ params.row.age)
                    }
                },
                {
                    title: 'Address',
                    key: 'address',
                },
                {
                    title: 'Date',
                    key: 'date',
                },
            ],
            loading: false,
            list: aTestList,
            sum:{
                name: 'Jim Green',
                age: 24,
                address: 'London',
                date: '2016-10-01',
            },
            size: '',
            theme: '',
            isBorder: true,
            stripe: true,
        }
    },
    mounted() {},
    methods: {}
}
</script>
<style lang="less">
.table{
    padding: 10px;
    &.dark{
        background: #333;
    }
}

</style>
