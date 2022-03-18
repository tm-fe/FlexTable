<template>
    <div>
        <h3>固定列</h3>
        <p>
            左右固定列
            <a
                href="https://github.com/tm-fe/FlexTable/blob/master/examples/features/fixedLeft.vue"
                >source code</a
            >
        </p>
        <div @click="click">切换</div>
        <flex-table
            v-if="show"
            :loading="loading"
            :columns="columnsData"
            :data="list"
            :sum="sum"
            :fixed-head="true"
            @on-sort-change="onSortChange"
        >
            <template slot-scope="{ row, index }" slot="img">
                <div style="padding: 15px 20px">
                    <img :src="getImg" />
                </div>
            </template>
        </flex-table>
    </div>
</template>
<script>
// import flexTable from '../../index.js';
import imgSrc from './123.png';
const aTestList = [];
for (let i = 0; i < 5; i++) {
    const oTestData = {
        name: 'John BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn BrownJohn Brown',
        age: 18,
        hegith: '178',
        address: 'New York No. 1 Lake Park',
        // address: 'New York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake ParkNew New York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake ParkNew New York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake ParkNew New York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake ParkNew New York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake New York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake New York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake New York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake New York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake New York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake New York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake New York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake Park',
        date: '2016-10-03',
        _disabled: false,
        _isChecked: true,
    };
    aTestList.push(oTestData);
}
console.time('fixed');
export default {
    // components:{
    //     flexTable
    // },
    data() {
        return {
            getImg: '123',
            columnsData: [],
            columns: [
                {
                    type: 'selection',
                    width: 20,
                    align: 'center',
                    fixed: 'left',
                },
                {
                    title: 'img',
                    key: 'img',
                    width: 200,
                    fixed: 'left',
                    sortable: true,
                    type: 'slot',
                },
                {
                    title: 'Name',
                    key: 'name',
                    width: 400,
                    fixed: 'left',
                    sortable: true,
                },
                {
                    title: 'Height',
                    key: 'hegith',
                    width: 300,
                },
                {
                    title: 'Address',
                    key: 'address',
                    width: 500,
                },
                {
                    title: 'Date',
                    key: 'date',
                    width: 200,
                    sortable: true,
                },
            ],
            loading: false,
            list: [],
            sum: {
                name: 'Jim Green',
                age: 24,
                hegith: '-',
                address: 'London',
                date: '2016-10-01',
            },
            show: true,
        };
    },
    mounted() {
        console.timeEnd('fixed');
        this.columnsData = this.columns;
        this.loading = true;
        this.list = aTestList;

        setTimeout(() => {
            this.loading = false;
            this.getImg = imgSrc;
        }, 2000);
    },
    methods: {
        onSortChange(obj) {
            console.log(obj);
        },
        click() {
            // this.show = !this.show;
            this.loading = true;
            setTimeout(() => {
                this.loading = false;
                this.getImg = imgSrc;
                this.list = aTestList;
            }, 2000);
        },
    },
};
</script>