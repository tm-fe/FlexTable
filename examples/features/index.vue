<template>
    <div>
        <h3>基础用法</h3>
        <p>
            表格的简单用法
            <a
                href="https://github.com/tm-fe/FlexTable/blob/master/examples/features/index.vue"
                >source code</a
            >
        </p>
        <button @click="aaa">aaaaaa</button>
        <flex-table
            resizable
            :loading="loading"
            :columns="columns"
            :data="list"
            :minWidth="80"
            :maxWidth="600"
            uniqueKey="myid"
            :headSum="headSum"
            fixedHead
            @on-scroll-x="onTableScroll"
            @on-row-click="handleRowClick"
            @on-selection-change="handleSelection"
        >
            <template slot-scope="{ row }" slot="name">
                <div v-if="row.type">slotSum</div>
                <div v-if="!row.type">
                    {{ row.name }}
                </div>
            </template>
        </flex-table>
    </div>
</template>
<script>
// import flexTable from '../../index.js';

const aTestList = [];
for (let i = 0; i < 20; i++) {
    const oTestData = {
        myid: i,
        name: "John Brownhigh schoolhigh schoolhigh schoolhigh schoolhigh schoolhigh schoolhigh schoolhigh schoolhigh schoolhigh schoolhigh schoolhigh schoolhigh schoolhigh schoolhigh schoolhigh school" + i,
        age: 18,
        sex: "男",
        school: "high school",
        color: "red",
        address: "New York No. 1 Lake Park",
        date: "2016-10-03",
    };
    aTestList.push(oTestData);
}

export default {
    // components:{
    //     flexTable
    // },
    data() {
        return {
            selectData: [],
            columns: [
                {
                    type: "selection",
// 
                    align: "center",
                    fixed: 'left',
                },
                {
                    title: "Name",
                    key: "name",
                    width: 240,
                    // maxWidth: 250,
                    // minWidth: 150,
                    // type: "slot",
                    fixed: 'left',
                },
                {
                    title: "Age",
                    key: "age",
                    // width: 140,
                    align: 'right',
                    // render(h, params) {
                    //     return h("span", "age: " + params.row.age);
                    // },
                    fixed: 'left',
                },
                {
                    title: "Address",
                    key: "address",
                    sortable: true,
                    fixed: 'left',
                },
                {
                    title: "Sex",
                    key: "sex",
                },
                {
                    title: "Schoolasdfasdfsadf",
                    key: "school",
                    align: 'right',
                    width: 500,
                    sortable: true,
                },
                {
                    title: "Color",
                    key: "color",
                    width: 140,
                },
                {
                    title: "Date",
                    key: "date",
                    width: 240,
                    fixed: 'rigth',
                },
            ],
            loading: false,
            list: [],
            sum: {
                name: "Jim Green",
                age: 24,
                address: "London",
                date: "2016-10-01",
            },
            headSum: {
                type: "headSum",
                name: "I m Head Sum",
                age: 24,
                sex: '1234',
                address: "London",
                date: "2016-10-01",
            },
        };
    },
    beforeCreate() {
        console.log('A组件 beforeCreate')
    },
    created() {
        console.log('A组件 created')
    },
    mounted() {
        console.log('A组件 mounted')
    },
    beforeDestroy() {
        console.log('A组件 beforeDestroy')
    },
    destroyed() {
        console.log('A组件 destroyed')
    },
    methods: {
        onTableScroll(event) {
           console.log(event.target.scrollLeft);
        },
        handleRowClick(index, row) {
          console.log(index, row);
        },
        handleSelection(row) {
            console.log("on-selection-change", row.length);
        },
        aaa(){
            console.log('在 A组件 点击了路由跳转 至 B组件: ');
            this.$router.push({ path: 'autoCalWidth' });
        }
    },
};
</script>