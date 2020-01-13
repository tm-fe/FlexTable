<template>
<div>
    <h3>多选</h3>
    <p>选择行 <a href="https://github.com/tm-fe/FlexTable/blob/master/examples/features/selectable.vue">source code</a></p>
    
    <flex-table
        :loading="loading" 
        :columns="columns" 
        :data="list"
        :sum="sum"
        :fixed-head="true"
        :async-render="10"
        @on-selection-change="onSelectionChange"
        @on-selection-cancel="onSelectionCancel"
        @on-all-cancel="onAllCancel"
    ></flex-table>
</div>
</template>
<script>
// import flexTable from '../../index.js';


const aTestList = [];
for(let i=0;i<80;i++){
    const oTestData = {
        name: 'John Brown',
        age: 18,
        address: 'New York No. 1 Lake Park',
        real_address: 'New York No. 1 Lake Park',
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
                    type: 'selection',
                    width: 20,
                    align: 'center',
                    fixed: 'left'
                },
                {
                    title: 'Name',
                    key: 'name',
                    width: 150
                },
                {
                    title: 'Age',
                    key: 'age',
                    width: 150,
                    render(h, params){
                        return h('span', 'age: '+ params.row.age)
                    }
                },
                {
                    title: 'Address',
                    key: 'address',
                    width: 250,
                },
                {
                    title: 'Real Address',
                    key: 'real_address',
                    width: 250,
                },
                {
                    title: 'Date',
                    key: 'date',
                    width: 250
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
        }
    },
    mounted() {},
    methods: {
        onSelectionChange(selection, row) {
            console.log('onSelectionChange', selection, row);
        },
        onSelectionCancel(row) {
            console.log('onSelectionCancel', row);
        },
        onAllCancel(cancelSelection) {
            console.log('onAllCancel', cancelSelection);
        },
    }
}
</script>