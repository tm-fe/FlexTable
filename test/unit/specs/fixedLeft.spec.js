/* eslint-disable no-undef */
import {
    createVue,
    // destroyVM,
    // triggerEvent,
    // waitImmediate,
} from '../util';

const aTestList = [];
for (let i = 0; i < 2; i += 1) {
    const oTestData = {
        name: 'John Brown',
        age: 18,
        address: 'New York No. 1 Lake Park',
        date: '2016-10-03',
    };
    aTestList.push(oTestData);
}


describe('Flex-Table', () => {
    // 基础测试
    describe('fixed left', () => {
        const vm = createVue({
            template: `
                <flex-table
                    resizable
                    :loading="loading" 
                    :columns="columns" 
                    :data="list"
                    :sum="sum"
                ></flex-table>
            `,
            data() {
                return {
                    columns: [
                        {
                            title: 'Name',
                            key: 'name',
                            width: 100,
                            fixed: 'left',
                        },
                        {
                            title: 'Age',
                            key: 'age',
                            render(h, params) {
                                return h('span', `age: ${params.row.age}`);
                            },
                        },
                        {
                            title: 'Address',
                            key: 'address',
                        },
                        {
                            title: 'Date',
                            key: 'date',
                        },
                    ],
                    loading: false,
                    list: aTestList,
                    sum: {
                        name: 'Jim Green',
                        age: 24,
                        address: 'London',
                        date: '2016-10-01',
                    },
                    height: 250,
                };
            },
        });

        // 检测 是否生成了fixed层
        it('check fixed layout', (done) => {
            const aFixedTable = vm.$el.querySelectorAll('.flex-table-fixed-left');
            expect(aFixedTable.length).to.eql(1);
            done();
        });

        // 检测 fixed层的head是否符合
        it('check fixed layout-head', (done) => {
            const aFixedTableHeadCol = vm.$el.querySelectorAll('.flex-table-fixed-left .flex-table-head .flex-table-col');
            let bCheck = true;
            aFixedTableHeadCol.forEach((element, index) => {
                console.log(element.innerText);
                // 如果不是第一列，并且存在内容，则表示渲染失败
                if (index > 0 && element.innerText) {
                    bCheck = false;
                }
            });
            expect(bCheck).to.eql(true);
            done();
        });
    });
});
