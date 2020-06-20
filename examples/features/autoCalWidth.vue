<template>
<div>
    <h3>基础用法</h3>
    <p>表格的简单用法 <a href="https://github.com/tm-fe/FlexTable/blob/master/examples/features/autoCalWidth.vue">source code</a></p>
    
    <flex-table
        resizable
        :loading="loading"
        :columns="columns"
        :data="list"
        :sum="sum"
        :minWidth="60"
        :maxWidth="600"
        :autoCalWidth="false"
        @on-scroll-x="onTableScroll"
    ></flex-table>
</div>
</template>
<script>
// import flexTable from '../../index.js';

const aTestList = [];
for(let i=0;i<10;i++){
    const oTestData = {
        name: 'John Brown',
        age: 18,
        sex: '男',
        school: 'high school',
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
                    width: 90
                },
                {
                    title: 'Age',
                    key: 'age',
                    width: 70,
                    render(h, params){
                        return h('span', 'age: '+ params.row.age)
                    }
                },
                {
                    title: 'Address',
                    key: 'address',
                    width: 170
                },
                {
                    title: 'Sex',
                    key: 'sex',
                    width: 20
                },
                {
                    title: 'School',
                    key: 'school',
                    width: 85
                },
                {
                    title: 'Date',
                    key: 'date',
                    width: 100
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
        onTableScroll(event) {
            console.log(event.target.scrollLeft);
        }
    }
}
</script>