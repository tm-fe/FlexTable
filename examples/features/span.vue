<template>
<div>
    <h3>合并行</h3>
    <p>span <a href="https://github.com/tm-fe/FlexTable/blob/master/examples/features/span.vue">source code</a></p>
    
    <flex-table
        resizable
        :loading="loading"
        :columns="columns"
        :data="list"
        :sum="sum"
        :minWidth="80"
        :maxWidth="600"
        :span-method="spanMethod"
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
                    width: 240
                },
                {
                    title: 'Age',
                    key: 'age',
                    width: 140,
                    render(h, params){
                        return h('span', 'age: '+ params.row.age)
                    }
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
        }
    },
    mounted() {},
    methods: {
        onTableScroll(event) {
            console.log(event.target.scrollLeft);
        },
        spanMethod(param) {
            if (param.column.key === 'age') {
                if (!param.rowIndex) {
                    return {
                        rowspan: 5,
                        colspan: 1
                    };
                }

                return {
                    rowspan: 0,
                    colspan: 1
                };
            }

            if (param.column.key === 'address') {
                if (param.rowIndex===1) {
                    return {
                        rowspan: 2,
                        colspan: 1
                    };
                }

                if (param.rowIndex === 2) {
                    return {
                        rowspan: 0,
                        colspan: 1
                    };
                }
            }

            return {
                rowspan: 1,
                colspan: 1
            };
        }
    }
}
</script>