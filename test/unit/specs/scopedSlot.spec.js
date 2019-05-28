/* eslint-disable no-undef */
import { createVue } from '../util';

const aTestList = [];
const aTestBtn = [];
const aTestHtml = [];
for (let i = 0; i < 5; i += 1) {
    const sCon = `2016-10-03(${i})`;
    const oTestData = {
        name: 'John Brown',
        age: 18 + i,
        address: 'New York No. 1 Lake Park',
        date: `<i>${sCon}</i>`,
    };
    aTestList.push(oTestData);
    aTestBtn.push(`View${i}`);
    aTestHtml.push(sCon);
}

describe('Flex-Table', () => {
    // 基础测试
    describe('scopedSlot', () => {
        const vm = createVue({
            template: `
                <flex-table
                    resizable
                    :loading="loading" 
                    :columns="columns" 
                    :data="list">
                    <template slot-scope="{ row, index }" slot="operation">
                        <button>View{{index}}</button>
                    </template>
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
                            type: 'html',
                        },
                        {
                            title: 'operation',
                            key: 'operation',
                            type: 'slot',
                        },
                    ],
                    loading: false,
                    list: aTestList,
                };
            },
            methods: {
            },
        });

        // 检测 slot
        it('check slot', async() => {
            const aOperation = vm.$el.querySelectorAll('.flex-table-body button');
            const aBtnStr = [];
            aOperation.forEach((elem) => {
                aBtnStr.push(elem.textContent);
            });

            expect(aTestBtn).to.eql(aBtnStr);
        });

        it('check html', async() => {
            const aOperation = vm.$el.querySelectorAll('.flex-table-body i');
            const aHtmlStr = [];
            aOperation.forEach((elem) => {
                aHtmlStr.push(elem.textContent);
            });

            expect(aTestHtml).to.eql(aHtmlStr);
        });
    });
});
