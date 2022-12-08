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
        <div @click="click">show</div>
        <flex-table
            v-show="show"
            resizable
            :loading="loading"            
            :columns="columns"
            :data="list"
            :headSum="sum"
            :fixed-head="true"
            vertical
            enable-row-check
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
for (let i = 0; i < 20; i++) {
    const oTestData = {
        name: 'John',
        age: 18,
        hegith: '178',
        address: 'New York No. 1 Lake Park',
        // address: 'New York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake ParkNew New York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake ParkNew New York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake ParkNew New York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake ParkNew New York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake New York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake New York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake New York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake New York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake New York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake New York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake New York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake Park',
        date: '2016-10-03',
        _disabled: i === 3,
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
                // {
                //     title: 'img',
                //     key: 'img',
                //     width: 100,
                //     fixed: 'left',
                //     sortable: true,
                //     type: 'slot',
                // },
                {
                    title: 'Name',
                    key: 'name',
                    width: 100,
                    fixed: 'left',
                    sortable: true,
                    vertical: false,
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
        this.list = aTestList;
        // this.getImg = imgSrc;
    },
    methods: {
        onSortChange(obj) {
            console.log(obj);
        },
        click() {
            // this.show = !this.show
            this.list = aTestList;
            this.columns.push({
                    title: 'img',
                    key: 'img',
                    width: 100,
                    fixed: 'left',
                    sortable: true,
                    type: 'slot',
                })
              
            setTimeout(() => {
                this.getImg = imgSrc;

                  
                
            }, 2000)
        },
    },
};
</script>