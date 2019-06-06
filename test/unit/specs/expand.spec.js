/* eslint-disable no-undef */
import {
    createVue,
    // destroyVM,
    triggerEvent,
    waitImmediate,
} from '../util';

const aTestList = [];
for (let i = 0; i < 1; i += 1) {
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
    describe('expand', () => {
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
                            type: 'expand',
                            width: 50,
                            render: (h, params) => {
                                return h('p', {}, params.row.name);
                            },
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
                    height: 250,
                };
            },
        });
        const elemExpandBtn = vm.$el.querySelector('.flex-table-col-icon');
        // 检测
        it('check expand', async () => {
            triggerEvent(elemExpandBtn, 'click');
            await waitImmediate();
            const elemNext = elemExpandBtn.parentElement.nextElementSibling;
            expect(elemNext.innerHTML).to.eql('<p>John Brown</p>');
        });

        it('check unexpanded', async () => {
            triggerEvent(elemExpandBtn, 'click');
            await waitImmediate();
            const elemNext = elemExpandBtn.parentElement.nextElementSibling;
            expect(elemNext).to.eql(null);
        });

        // destroyVM(vm); // 这里不用销毁方法，因为点击后出发vue的修改，如果销毁了vm，则获取dom有误
    });
});
