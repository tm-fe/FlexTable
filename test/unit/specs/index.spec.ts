import { expect } from 'chai';
import { createVue } from '@/util';
import { setFoot } from '@/tool';

const aTestList: FlexTableColumnOption[] = [];
const aTestData: string[] = [];
for (let i = 0; i < 10; i++) {
    const oTestData: FlexTableColumnOption = {
        name: 'John Brown',
        age: 18,
        address: 'New York No. 1 Lake Park',
        date: '2016-10-03',
    };
    aTestList.push(oTestData);
    Object.keys(oTestData).forEach((k) => {
        aTestData.push(oTestData[k].toString());
    });
}
describe('Flex-Table', () => {
    // 基础测试
    describe('base', () => {
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


        // 检测头部
        it('check head', (done) => {
            const aHead = vm.$el.querySelectorAll('.flex-table-head .flex-table-col>span');
            const aHeadTitle: string[] = [];
            aHead.forEach(function(node) {
                if (node && node.textContent) {
                    aHeadTitle.push(node.textContent.trim());
                }
            });
            expect(aHeadTitle).to.eql(['Name', 'Age', 'Address', 'Date']);
            done();
        });

        // 检测 输入的内容
        it('check body', (done) => {
            const aBodyRow = vm.$el.querySelectorAll('.flex-table-body .flex-table-row');
            const aBodyData: string[] = [];
            aBodyRow.forEach( (node) => {
                const aCol = node.querySelectorAll('.flex-table-col');
                aCol.forEach( (elem) => {
                    if (elem && elem.textContent) {
                        aBodyData.push(elem.textContent.trim());
                    }
                });
            });
            expect(aBodyData).to.eql(aTestData);
            done();
        });

        // 检测 汇总信息
        it('check sum', (done) => {
            const aFootRow = vm.$el.querySelectorAll('.flex-table-foot .flex-table-row .flex-table-col');
            const aFootLabel: string[] = [];
            const aFootValue: string[] = [];
            aFootRow.forEach( (node) => {
                const aDoms = node.querySelectorAll('p');
                setFoot(aDoms, aFootValue, aFootLabel);
            });
            expect(aFootValue).to.eql(['Jim Green', '24', 'London', '2016-10-01']);
            expect(aFootLabel).to.eql(['Name', 'Age', 'Address', 'Date']);
            done();
        });
    });
});
