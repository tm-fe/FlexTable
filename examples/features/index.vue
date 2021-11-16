<template>
<div>
    <h3>基础用法</h3>
    <p>表格的简单用法 <a href="https://github.com/tm-fe/FlexTable/blob/master/examples/features/index.vue">source code</a></p>
    
    <flex-table
        resizable
        :loading="loading"
        :columns="columns"
        :data="list"


        :minWidth="80"
        :maxWidth="600"
        @on-scroll-x="onTableScroll"
        @on-row-click="handleRowClick"
        fixed-x-scroll
        :selectedData="[1,2]"
        :virtualScroll="10"
        :virtualHeight="37"
    >
        <template slot-scope="{ row }" slot="name">
            <div v-if="row.type">
                slotSum
            </div>
            <div v-if="!row.type">
                {{row.name}}
            </div>
        </template>
    </flex-table>
</div>
</template>
<script>
// import flexTable from '../../index.js';

const aTestList = [];
for(let i=0;i<2000;i++){
    const oTestData = {
        id:i,
        name: 'John Brown' + i,
        age: 18,
        sex: '男',
        school: 'high school',
        color: 'red',
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
                    width: 240,
                    type: 'slot',
                    fixed: 'left',
                },
                {
                    title: 'Age',
                    key: 'age',
                    width: 140,
                    render(h, params){
                        return h('span', 'age: '+ params.row.age)
                    },
                    fixed: 'left',
                },
                {
                    title: 'Address',
                    key: 'address',
                    width: 240
                },
                {
                    title: 'Sex',
                    key: 'sex',
                    width: 140
                },
                {
                    title: 'School',
                    key: 'school',
                    width: 240
                },
                {
                    title: 'Color',
                    key: 'color',
                    width: 140
                },
                {
                    title: 'Date',
                    key: 'date',
                    width: 240
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
            headSum:{
                type: 'headSum',
                name: 'I m Head Sum',
                age: 24,
                address: 'London',
                date: '2016-10-01',
            }
        }
    },
    mounted() {},
    methods: {
        onTableScroll(event) {
            console.log(event.target.scrollLeft);
        },
        handleRowClick(index, row) {
            console.log(index, row);
        }
    }
}
</script>