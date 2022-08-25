<template>
<div>
    <h3>自动计算宽度-false</h3>
    <p>自动计算宽度-false <a href="https://github.com/tm-fe/FlexTable/blob/master/examples/features/autoCalWidth.vue">source code</a></p>
    
    <flex-table
        resizable
        :loading="loading"
        :columns="columns1"
        :data="list"
        :sum="sum"
        :minWidth="60"
        :maxWidth="600"
        :autoCalWidth="false"
        @on-scroll-x="onTableScroll"
    ></flex-table>
    <p></p>

    <flex-table
        resizable
        :loading="loading"
        :columns="columns2"
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
for(let i=0;i<5;i++){
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
            columns1: [
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
            columns2: [
                {
                    title: 'Name',
                    key: 'name',
                    width: 190,
                    fixed: 'left'
                },
                {
                    title: 'Age',
                    key: 'age',
                    width: 170,
                    render(h, params){
                        return h('span', 'age: '+ params.row.age)
                    }
                },
                {
                    title: 'Address',
                    key: 'address',
                    width: 270
                },
                {
                    title: 'Sex',
                    key: 'sex',
                    width: 120
                },
                {
                    title: 'School',
                    key: 'school',
                    width: 185
                },
                {
                    title: 'Date',
                    key: 'date',
                    width: 200
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
   beforeCreate() {
        console.log('B组件 beforeCreate')
    },
    created() {
        console.log('B组件 created')
    },
    mounted() {
        console.log('B组件 mounted')
    },
    beforeDestroy() {
        console.log('B组件 beforeDestroy')
    },
    destroyed() {
        console.log('B组件 destroyed')
    },
    methods: {
        onTableScroll(event) {
            console.log(event.target.scrollLeft);
        }
    }
}
</script>