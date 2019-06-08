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
function checkFixedLayout(vm, type) {
    const aFixedTable = vm.$el.querySelectorAll(`.flex-table-fixed-${type}`);
    expect(aFixedTable.length).to.eql(1);
}

function checkLayoutHead(vm, type, i) {
    const aFixedTableHeadCol = vm.$el.querySelectorAll(`.flex-table-fixed-${type} .flex-table-head .flex-table-col`);
    let bCheck = true;
    aFixedTableHeadCol.forEach((element, index) => {
        if (type === 'right') {
            console.log(element);
        }
        // 如果不是第2列，并且存在内容，则表示渲染失败
        if (index !== i && element.innerText) {
            bCheck = false;
        }
    });
    expect(bCheck).to.eql(true);
}

describe('Flex-Table', () => {
    // 基础测试
    describe('fixed', () => {
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
                            width: 100,
                            fixed: 'right',
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
        it('check fixed-left layout', (done) => {
            checkFixedLayout(vm, 'left');
            done();
        });

        it('check fixed-right layout', (done) => {
            checkFixedLayout(vm, 'right');
            done();
        });

        // 检测 fixed层的head是否符合
        it('check fixed-left layout-head', (done) => {
            checkLayoutHead(vm, 'left', 0);
            done();
        });
        it('check fixed-right layout-head', (done) => {
            checkLayoutHead(vm, 'right', vm.$children[0].columns.length - 1);
            done();
        });
    });
});
