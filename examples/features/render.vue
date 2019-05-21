<template>
    <div>
        <h3>render function</h3>
        <p>render & renderHeader: <a href="https://github.com/tm-fe/FlexTable/blob/master/examples/features/render.vue">source code</a></p>
        
        <flex-table
            :loading="loading" 
            :columns="columns" 
            :data="list"
            :sum="sum"
            :height="height"
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
                    renderHeader(h, params) {
                        return h('span', 'Custom Title : '+ params.column.title)
                    }
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
    }
}
</script>