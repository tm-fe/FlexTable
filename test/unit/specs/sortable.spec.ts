import { createVue, triggerEvent, waitImmediate } from '@/util';
import { expect } from 'chai';
import Vue from 'vue';

const aTestList: FlexTableColumnOption[] = [];
for (let i = 0; i < 5; i += 1) {
    const oTestData = {
        name: 'John Brown',
        age: 18 + i,
        address: 'New York No. 1 Lake Park',
        date: '2016-10-03',
    };
    aTestList.push(oTestData);
}

describe('Flex-Table', () => {
    // 基础测试
    describe('sortable', () => {
        const vm: Vue = createVue({
            template: `
                <flex-table
                    resizable
                    :loading="loading"
                    :columns="columns"
                    :data="list"
                    :sum="sum"
                    @on-sort-change="onSortChange"
                ></flex-table>
            `,
            data() {
                return {
                    columns: [
                        {
                            title: 'Name',
                            key: 'name',
                        },
                        {
                            title: 'Age',
                            key: 'age',
                            sortable: true,
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
                };
            },
            methods: {
                onSortChange(obj: SortOption) {
                    const list = vm.$data.list;
                    const sKey = obj.key;
                    const sOrder = obj.order;
                    const aList = list.sort((item1: any, item2: any) => {
                        if (sOrder === 'desc') {
                            return item2[sKey] - item1[sKey];
                        }
                        return item1[sKey] - item2[sKey];
                    });
                    vm.$data.list = aList;
                },
            },
        });

        const sSortSelector = '.flex-table-head .flex-table-col:nth-child(2) .flex-table-sort i';
        const aHeadAgeSort = vm.$el.querySelectorAll(sSortSelector);

        // 检测 倒叙
        it('check desc', async () => {
            triggerEvent(aHeadAgeSort[1], 'click');
            await checkOrder(vm, 'desc');
        });

        // 检测 升序
        it('check asc', async () => {
            triggerEvent(aHeadAgeSort[0], 'click');
            await checkOrder(vm, 'asc');
        });

        // 检测 动态修改columns
        it('change columns: desc', async () => {
            await chnageColumns(vm, 'desc');
        });

        it('change columns: asc', async () => {
            await chnageColumns(vm, 'asc');
        });
    });
});
async function chnageColumns(vm: Vue, type: string) {
    vm.$data.columns = [
        {
            title: 'Name',
            key: 'name',
        },
        {
            title: 'Age',
            key: 'age',
        },
        {
            title: 'Address',
            key: 'address',
        },
        {
            title: 'Date',
            key: 'date',
            sortable: true,
            sortType: type,
        },
    ];
    await waitImmediate();
    let sOrderSelector = '.flex-table-head .flex-table-col:nth-child(4) .flex-table-sort .flex-table-arrow-';
    sOrderSelector += (type === 'desc' ? 'dropdown' : 'dropup');
    const elemHeadDateSort = vm.$el.querySelector(sOrderSelector);
    let bCheck = false;
    if (elemHeadDateSort && elemHeadDateSort.classList) {
        bCheck = elemHeadDateSort.classList.contains('on');
    }
    expect(bCheck).to.eql(true);
}

async function checkOrder(vm: Vue, type: string) {
    let aOrderList: FlexTableColumnOption[] = JSON.parse(JSON.stringify(aTestList));
    aOrderList = aOrderList.sort((item1: any, item2: any) => {
        if ( type === 'desc') {
            return item2.age - item1.age;
        }
        return item1.age - item2.age;
    });
    const aTestData: string[] = [];
    aOrderList.forEach((item) => {
        Object.keys(item).forEach((k) => {
            aTestData.push(item[k].toString());
        });
    });
    await waitImmediate();
    const aBodyRow: NodeListOf<Element> = vm.$el.querySelectorAll('.flex-table-body .flex-table-row');
    const aBodyData: string[] = [];
    aBodyRow.forEach((node) => {
        const aCol = node.querySelectorAll('.flex-table-col');
        aCol.forEach((elem) => {
            if (elem && elem.textContent) {
                aBodyData.push(elem.textContent.trim());
            }
        });
    });
    expect(aBodyData).to.eql(aTestData);
}

