/* eslint-disable no-undef */
import {
    createVue,
    triggerEvent,
    wait,
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
    describe('select', () => {
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
                            type: 'selection',
                            width: 20,
                            align: 'center',
                        },
                        {
                            title: 'Name',
                            key: 'name',
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
        const elemAllCheckedBtn = vm.$el.querySelector('.flex-table-head input[type="checkbox"]');
        // 检测 全选
        it('check select all', async () => {
            triggerEvent(elemAllCheckedBtn, 'click');
            vm.$children[0].$children[0].$children[0].toggle(); // 这里需要手动程序触发
            await wait(500);
            let bCheck = true;
            const aElemBodyCheck = vm.$el.querySelectorAll('.flex-table-body input[type="checkbox"]');

            aElemBodyCheck.forEach((element) => {
                if (!element.checked) {
                    bCheck = false;
                }
            });

            expect(bCheck).to.eql(true);
        });

        // 检测取消全选
        it('check unselect all', async () => {
            triggerEvent(elemAllCheckedBtn, 'click');
            await wait(500);
            vm.$children[0].$children[0].$children[0].toggle(); // 这里需要手动程序触发
            await wait(500);
            let bCheck = true;
            const aElemBodyCheck = vm.$el.querySelectorAll('.flex-table-body input[type="checkbox"]');

            aElemBodyCheck.forEach((element) => {
                if (element.checked) {
                    bCheck = false;
                }
            });

            expect(bCheck).to.eql(true);
        });
    });
});
