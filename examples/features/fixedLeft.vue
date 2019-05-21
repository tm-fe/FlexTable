<template>
    <div>
        <h3>固定列</h3>
        <p>左固定列 <a href="https://github.com/tm-fe/FlexTable/blob/master/examples/features/fixedLeft.vue">source code</a></p>
        
        <flex-table
            :loading="loading" 
            :columns="columns" 
            :data="list"
            :sum="sum"
            @on-sort-change="onSortChange"
        ></flex-table>
    </div>
</template>
<script>
// import flexTable from '../../index.js';

const aTestList = [];
for(let i=0;i<20;i++){
    const oTestData = {
        name: 'John Brown',
        age: 18,
        hegith: '178',
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
                    width: 100,
                    fixed: 'left',
                    sortable: true,
                },
                {
                    title: 'Age',
                    key: 'age',
                    fixed: 'left',
                    width: 150,
                    sortable: true,
                    render(h, params){
                        return h('span', 'age: '+ params.row.age)
                    }
                },
                {
                    title: 'Height',
                    key: 'hegith',
                    width: 300,
                },
                {
                    title: 'Address',
                    key: 'address',
                    width: 500,
                },
                {
                    title: 'Date',
                    key: 'date',
                    width: 200,
                    sortable: true,
                },
            ],
            loading: false,
            list: aTestList,
            sum:{
                name: 'Jim Green',
                age: 24,
                hegith: '-',
                address: 'London',
                date: '2016-10-01'
            },
        }
    },
    methods: {
        onSortChange(obj) {
            console.log(obj);
        },
    }
}
</script>