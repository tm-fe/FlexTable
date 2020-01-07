import {
    createVue,
    destroyVM,
} from '@/util';
import Vue from 'vue';
import { expect } from 'chai';

const aTestList: FlexTableColumnOption[] = [];
for (let i = 0; i < 5; i += 1) {
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
    describe('resizable', () => {
        const nInitWidth = 50;
        const nAddWidth = 100;
        const vm: Vue = createVue({
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
                            width: nInitWidth,
                            renderHeader(h: Vue.CreateElement, params: FlexTableRow) {
                                return h('span', `Custom Title : ${params.column.title}`);
                            },
                        },
                        {
                            title: 'Age',
                            key: 'age',
                            width: nInitWidth,
                            resizable: false,
                            render(h: Vue.CreateElement, params: FlexTableRow) {
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
                };
            },
        });

        const $resizeDiv = vm.$el.querySelectorAll('.flex-table-head .flex-table-col-resize')[0];
        const $resizeDivAge = vm.$el.querySelectorAll('.flex-table-head .flex-table-col-resize')[1];
        const vmTable: any = vm.$children[0];
        const vmHeaer = vmTable.$children[0];

        vmHeaer.onColResize.call(vmHeaer, {
            clientX: 0,
            target: $resizeDiv,
            stopPropagation: () => void 0,
        }, 0);

        vmTable.onColResizeMove.call(vmTable, {
            clientX: nAddWidth,
            target: $resizeDiv,
            stopPropagation: () => void 0,
        });

        vmHeaer.onColResize.call(vmHeaer, {
            clientX: 0,
            target: $resizeDivAge,
            stopPropagation: () => void 0,
        }, 0);

        vmTable.onColResizeMove.call(vmTable, {
            clientX: nAddWidth,
            target: $resizeDivAge,
            stopPropagation: () => void 0,
        });

        vmTable.onColResizeEnd.call(vmTable);

        // 检测
        it('可以调整宽度', () => {
            const row = vmTable.tableColumns[0];
            expect(row.width).to.eql(nInitWidth + nAddWidth);
        });

        it('不可调整宽度', () => {
            const row = vmTable.tableColumns[1];
            expect(row.width).to.eql(nInitWidth);
        });

        destroyVM(vm);
    });
});
