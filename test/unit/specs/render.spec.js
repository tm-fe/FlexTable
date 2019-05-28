/* eslint-disable no-undef */
import { createVue } from '../util';

const aTestList = [];
const aTestData = [];
for (let i = 0; i < 5; i += 1) {
    const oTestData = {
        name: 'John Brown',
        age: 18,
        address: 'New York No. 1 Lake Park',
        date: '2016-10-03',
    };
    aTestList.push(oTestData);
    Object.keys(oTestData).forEach((k) => {
        const sValue = oTestData[k].toString();
        if (k === 'age') {
            aTestData.push(`age: ${sValue}`);
        } else {
            aTestData.push(sValue);
        }
    });
}

describe('Flex-Table', () => {
    // 基础测试
    describe('render', () => {
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
                            renderHeader(h, params) {
                                return h('span', `Custom Title : ${params.column.title}`);
                            },
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
                };
            },
        });

        // 检测头部
        it('check head', (done) => {
            const aHead = vm.$el.querySelectorAll('.flex-table-head .flex-table-col>span');
            const aHeadTitle = [];
            aHead.forEach((node) => {
                aHeadTitle.push(node.textContent);
            });
            expect(aHeadTitle).to.eql(['Custom Title : Name', 'Age', 'Address', 'Date']);
            done();
        });

        // 检测 输入的内容
        it('check body', (done) => {
            const aBodyRow = vm.$el.querySelectorAll('.flex-table-body .flex-table-row');
            const aBodyData = [];
            aBodyRow.forEach((node) => {
                const aCol = node.querySelectorAll('.flex-table-col');
                aCol.forEach((elem) => {
                    aBodyData.push(elem.textContent.trim());
                });
            });
            expect(aBodyData).to.eql(aTestData);
            done();
        });

        // 检测 汇总信息
        it('check sum', (done) => {
            const aFootRow = vm.$el.querySelectorAll('.flex-table-foot .flex-table-row .flex-table-col');
            const aFootLabel = [];
            const aFootValue = [];
            aFootRow.forEach((node) => {
                const aDoms = node.children;
                aFootValue.push(aDoms[0].textContent);
                aFootLabel.push(aDoms[1].textContent);
            });
            expect(aFootValue).to.eql(['Jim Green', 'age: 24', 'London', '2016-10-01']);
            expect(aFootLabel).to.eql(['Name', 'Age', 'Address', 'Date']);
            done();
        });
    });
});
