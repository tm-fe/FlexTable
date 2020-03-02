import {
    createVue,
    // destroyVM,
    // triggerEvent,
    waitImmediate,
    wait
} from '@/util';
import { expect } from 'chai';
import Vue from 'vue';

const aTestList: FlexTableColumnOption[] = [];
for (let i = 0; i < 2; i += 1) {
    const oTestData = {
        name: 'John Brown',
        age: 18,
        address: 'New York No. 1 Lake Park',
        date: '2016-10-03',
    };
    aTestList.push(oTestData);
}
function checkFixedLayout(vm: Vue, type: string) {
    const aFixedTable = vm.$el.querySelectorAll(`.flex-table-fixed-${type}`);
    expect(aFixedTable.length).to.eql(1);
}

function checkLayoutHead(vm: Vue, type: string, i: number) {
    const aFixedTableHeadCol = vm.$el.querySelectorAll(`.flex-table-fixed-${type} .flex-table-head .flex-table-col`);
    let bCheck = true;
    aFixedTableHeadCol.forEach((element: any, index: number) => {
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
        const vm: Vue = createVue({
            template: `
                <flex-table
                resizable
                :loading="loading"
                :columns="columns"
                :data="list"
                :sum="sum"
                :height="height"
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
                            render(h: Vue.CreateElement, params: FlexTableRow ) {
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
                    height: 0,
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
            checkLayoutHead(vm, 'right', vm.$data.columns.length - 1);
            done();
        });

        // 检测 fiexed header
        it('check fixed-header base', async () => {
            vm.$data.height = 250;
            await wait(20);
            let bCheck = false;
            const elemBody = vm.$el.querySelector('.flex-table-body');

            if (elemBody && elemBody.classList) {
                bCheck = elemBody.classList.contains('flex-table-fixed-header');
            }

            expect(bCheck).to.eql(true);
        });
        it('check fixed-header height', async () => {
            const nHeight = 250;
            vm.$data.height = nHeight;
            await waitImmediate();
            let nMaxHeight = 0;
            const elemBody = vm.$el.querySelector('.flex-table-body') as HTMLElement;

            if (elemBody && elemBody.style && elemBody.style.maxHeight) {
                nMaxHeight = Number(elemBody.style.maxHeight.replace('px', ''));
            }

            expect(nMaxHeight).to.eql(nHeight);
        });
    });
});
