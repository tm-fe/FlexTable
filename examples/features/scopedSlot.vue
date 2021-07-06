<template>
<div>
    <h3>scoped-slot</h3>
    <p>scoped-slot <a href="https://github.com/tm-fe/FlexTable/blob/master/examples/features/scopedSlot.vue">source code</a></p>
    
    <flex-table
        resizable
        :loading="loading" 
        :columns="columns" 
        :data="list"
        uniqueKey="name"
        :sum="sum">
        <template slot-scope="{ row, index }" slot="operation">
            <button style="margin-right: 5px" @click="show(index)">View</button>
            <button @click="remove(index)">Delete</button>
        </template>
    </flex-table>
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
                {
                    title: 'operation',
                    key: 'operation',
                    type: 'slot',
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
        show(index) {
            alert('show ' + index);
        },
        remove(index) {
            alert('remove ' + index);
        }
    }
}
</script>