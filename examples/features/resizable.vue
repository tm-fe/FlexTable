<template>
    <div>
        <h3>调整宽度</h3>
        <p>拖动调整宽度 <a href="https://github.com/tm-fe/FlexTable/blob/master/examples/features/resizable.vue">source code</a></p>

        <flex-table resizable
                    :loading="loading"
                    :columns="columns"
                    :data="list"
                    :sum="sum"
                    :height="height"
                    :minWidth="40"
                    :maxWidth="300"
                    @on-col-width-resize="onResizeWidth"
                    @on-sort-change="onSortChange"></flex-table>
    </div>
</template>
<script>
// import flexTable from '../../index.js';

const aTestList = [];
for (let i = 0; i < 20; i++) {
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
    data() {
        return {
            columns: [
                {
                    title: 'Name',
                    key: 'name',
                    width: 100,
                    fixed: 'left',
                    sortable: true,
                    // resizable: false,
                    minWidth: 100,
                    maxWidth: 200,
                },
                {
                    title: 'Age',
                    key: 'age',
                    sortable: true,
                    render(h, params) {
                        return h('span', 'age: ' + params.row.age)
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
                    sortable: true,
                },
            ],
            loading: false,
            list: aTestList,
            sum: {
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
        onResizeWidth(newWidth, oldWidth, column, event) {
            console.log(`newWidth--${newWidth}`);
            console.log(`oldWidth--${oldWidth}`);
            console.log(`column--${JSON.stringify(column)}`);
            console.log(event);
        }
    }
}
</script>