<template>
    <div>
        <h3>排序</h3>
        <p><a href="https://github.com/tm-fe/FlexTable/blob/master/examples/features/sortable.vue">source code</a></p>
        
        <flex-table
            :loading="loading" 
            :columns="columns" 
            :data="list"
            @on-sort-change="onSortChange"
        ></flex-table>
    </div>
</template>
<script>
import flexTable from '../../index.js';

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
    components:{
        flexTable
    },
    data(){
        return {
            columns: [
                {
                    title: 'Name',
                    key: 'name',
                    width: 100,
                    sortable: true,
                },
                {
                    title: 'Age',
                    key: 'age',
                    sortable: true,
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
        }
    },
    methods: {
        onSortChange(obj) {
            console.log(obj);
        },
    }
}
</script>