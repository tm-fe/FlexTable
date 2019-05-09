<template>
<div>
    <flex-table
        resizable
        :loading="loading" 
        :columns="columns" 
        :data="list"
        :sum="sum"
        :height="height"
    ></flex-table>

    <pre class="code" v-html='rawHtml'></pre>
</div>
</template>
<script>
import flexTable from '../../index.js';

const aTestList = [];
for(let i=0;i<20;i++){
    const oTestData = {
        name: 'John Brown',
        age: 18,
        address: 'New York No. 1 Lake Park',
        date: '2016-10-03',
        _checked: Math.random() > 0.7, // only for selection=true
        _disabled: Math.random() > 0.7, // only for selection=true
    };
    aTestList.push(oTestData);
}

export default {
    components:{
        flexTable
    },
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
            height: 250, // for table max-height
            rawHtml: `import flexTable from 'tm-flextable';`,
        }
    },
    methods: {}
}
</script>
<style lang="less">
    .code{
        border: 1px solid #d8d8d8;
        padding: 15px;
    }
</style>