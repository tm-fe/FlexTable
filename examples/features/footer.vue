<template>
    <flex-table
        :loading="loading" 
        :columns="columns" 
        :data="list"
        :sum="sum"
    >
        <template #age={row}>
            <p>{{row.age}}</p>
        </template>
        <template #[firstColumn]={row,type,key}>
            <p v-if="type==='foot'">汇总</p>
            <p v-else>{{row[key]}}</p>
        </template>
    </flex-table>
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
                    width: 100,
                    type: 'slot'
                },
                {
                    title: 'Age',
                    key: 'age',
                    type: 'slot'
                },
                {
                    title: 'Address',
                    key: 'address',
                    width: 300,
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
                date: '2016-10-01'
            },
            firstColumn: 'name'
        }
    }
}
</script>
<style>
.flex-table-foot .flex-table-col:first-child .flex-table-slot-foot + .foot-label {
    display: none;
}
</style>