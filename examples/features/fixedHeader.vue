<template>
   <div>
        <h3>固定表头</h3>
        <p>固定表头 <a href="https://github.com/tm-fe/FlexTable/blob/master/examples/features/fixedHeader.vue">source code</a></p>
        
        <flex-table
            :loading="loading" 
            :columns="columns" 
            :data="list"
            :sum="sum"
            :height="height"
        ></flex-table>

        <div style="margin-top: 40px">
            <flex-table
                :loading="loading" 
                :columns="columns" 
                :data="[]"
                :height="height"
            ></flex-table>
        </div>
   </div>
</template>
<script>
// import flexTable from '../../index.js';

const aTestList = [];
for(let i=0;i<20;i++){
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
                },
                {
                    title: 'Age',
                    key: 'age',
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