import { createVue, triggerEvent, wait } from '@/util';
import { expect } from 'chai';
import Vue from 'vue';

const aTestList: FlexTableColumnOption[] = [];
for (let i = 0; i < 5; i += 1) {
    const sCon = `2016-10-03(${i})`;
    const oTestData = {
        name: 'John Brown',
        age: 18 + i,
        address: 'New York No. 1 Lake Park',
        date: `<i>${sCon}</i>`,
    };
    aTestList.push(oTestData);
}

describe('Flex-Table', () => {
    // 基础测试
    describe('scrollBar', () => {
        const vm: Vue = createVue({
            template: `
                <flex-table
                    :loading="loading"
                    :columns="columns"
                    :height="height"
                    :data="list">
                </flex-table>
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
                        },
                        {
                            title: 'Address',
                            key: 'address',
                        },
                        {
                            title: 'Date',
                            key: 'date',
                        },
                        {
                            title: 'operation',
                            key: 'operation',
                        },
                    ],
                    loading: false,
                    height: 200,
                    list: aTestList,
                };
            },
            methods: {
            },
        });

        // 检测 滚动条
        it('check', async () => {
            const vmTable: any = vm.$children[0];
            vmTable.bodyH = 210; // 不能获取offsetHeight，所以这样处理
            await wait(0);
            const srcollY = vm.$el.querySelectorAll('.flex-table-scroll-y');
            expect(srcollY.length).to.eql(1);
        });
    });
});
