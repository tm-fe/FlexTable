import {
    createVue,
    // destroyVM,
    triggerEvent,
    waitImmediate,
} from '@/util';
import { expect } from 'chai';

const aTestList: FlexTableColumnOption[] = [];
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
                            render: (h: any, params: FlexTableRow) => {
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
                            render(h: any, params: FlexTableRow) {
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
            let elemNextHtml = '';
            if (elemExpandBtn) {
                triggerEvent(elemExpandBtn, 'click');
                await waitImmediate();
                if ( elemExpandBtn.parentElement ) {
                    const elemNext = elemExpandBtn.parentElement.nextElementSibling;
                    if ( elemNext && elemNext.innerHTML) {
                        elemNextHtml = elemNext.innerHTML;
                    }
                }
            }

            expect(elemNextHtml).to.eql('<p>John Brown</p>');
        });

        it('check unexpanded', async () => {
            triggerEvent(elemExpandBtn, 'click');
            await waitImmediate();
            let elemNext;
            if (elemExpandBtn && elemExpandBtn.parentElement){
                elemNext = elemExpandBtn.parentElement.nextElementSibling;
            }

            expect(elemNext).to.eql(null);
        });

        // destroyVM(vm); // 这里不用销毁方法，因为点击后出发vue的修改，如果销毁了vm，则获取dom有误
    });
});
