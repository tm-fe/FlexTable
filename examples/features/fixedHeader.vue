<template>
    <flex-table
        resizable
        :loading="loading" 
        :columns="columns" 
        :data="list"
        :sum="sum"
        :height="height"
        @on-sort-change="onSortChange"
    ></flex-table>
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
                    type: 'selection',
                    width: 20,
                    align: 'center',
                    fixed: 'left'
                },
                {
                    title: 'Name',
                    key: 'name',
                    width: 100,
                    fixed: 'left',
                    sortable: true,
                },
                {
                    title: 'Age',
                    key: 'age',
                    sortable: true,
                    render(h, params){
                        return h('span', 'age: '+ params.row.age)
                    }
                },
                {
                    title: 'Address',
                    key: 'address',
                    width: 300,
                },
                {
                    title: 'Date',
                    key: 'date',
                    sortable: true,
                },
            ],
            loading: false,
            list: aTestList,
            sum:{
                name: 'Jim Green',
                age: 24,
                address: 'London',
                date: '2016-10-01'
            },
            height: 250, // for table max-height
        }
    },
    methods: {
        onSortChange(obj) {
            console.log(obj);
        },
    }
}
</script>