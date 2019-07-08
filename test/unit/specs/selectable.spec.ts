import {
    createVue,
    triggerEvent,
    wait,
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


describe('Flex-Table', () => {
    // 基础测试
    describe('select', () => {
        const vm: any = createVue({
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
        const elemAllCheckedBtn: any = vm.$el.querySelector('.flex-table-head input[type="checkbox"]');
        // 检测 全选
        it('check select all', async () => {
            triggerEvent(elemAllCheckedBtn, 'click');
            vm.$children[0].$children[0].$children[0].toggle(); // 这里需要手动程序触发
            await wait(100);
            let bCheck = true;
            const aElemBodyCheck = vm.$el.querySelectorAll('.flex-table-body input[type="checkbox"]');

            aElemBodyCheck.forEach((element: any) => {
                if (!element.checked) {
                    bCheck = false;
                }
            });

            expect(bCheck).to.eql(true);
        });

        // 检测取消全选
        it('check unselect all', async () => {
            triggerEvent(elemAllCheckedBtn, 'click');
            await wait(100);
            vm.$children[0].$children[0].$children[0].toggle(); // 这里需要手动程序触发
            await wait(100);
            let bCheck = true;
            const aElemBodyCheck = vm.$el.querySelectorAll('.flex-table-body input[type="checkbox"]');

            aElemBodyCheck.forEach((element: any) => {
                if (element.checked) {
                    bCheck = false;
                }
            });

            expect(bCheck).to.eql(true);
        });

        // 检测 全选,有diabled的情况
        it('check select all-_isDisabled', async () => {
            vm.$children[0].dataList[0]._isDisabled = true;
            triggerEvent(elemAllCheckedBtn, 'click');
            vm.$children[0].$children[0].$children[0].toggle(); // 这里需要手动程序触发
            await wait(100);
            const aCheck: boolean[] = [];
            const aElemBodyCheck = vm.$el.querySelectorAll('.flex-table-body input[type="checkbox"]');

            aElemBodyCheck.forEach((element: any) => {
                aCheck.push(element.checked);
            });

            expect(aCheck).to.eql([false, true]);
        });

        // 检测 取消全选,有diabled的情况
        it('check unselect all-_isDisabled', async () => {
            vm.$children[0].dataList[0]._isDisabled = true;
            triggerEvent(elemAllCheckedBtn, 'click');
            vm.$children[0].$children[0].$children[0].toggle(); // 这里需要手动程序触发
            await wait(100);
            const aCheck: boolean[] = [];
            const aElemBodyCheck = vm.$el.querySelectorAll('.flex-table-body input[type="checkbox"]');

            aElemBodyCheck.forEach((element: any) => {
                aCheck.push(element.checked);
            });

            expect(aCheck).to.eql([false, false]);
        });

        // 检测 全选后，点击body中一个input 此时全选应该被取消
        it('check unselect all->body unselect', async () => {
            vm.$children[0].dataList[0]._isDisabled = false;
            triggerEvent(elemAllCheckedBtn, 'click');
            vm.$children[0].$children[0].$children[0].toggle(); // 这里需要手动程序触发
            await wait(100);
            const aElemBodyCheck = vm.$el.querySelectorAll('.flex-table-body input[type="checkbox"]');
            triggerEvent(aElemBodyCheck[0], 'click');
            vm.$children[0].$children[1].$children[0].toggleSelect(0); // 这里需要手动程序触发
            await wait(100);
            const bCheck = elemAllCheckedBtn.checked;

            expect(bCheck).to.eql(false);

            // 还原回去
            triggerEvent(aElemBodyCheck[0], 'click');
            vm.$children[0].$children[1].$children[0].toggleSelect(0); // 这里需要手动程序触发
        });

        // 检测 点击body中的input 此时全选应该被选中
        it('check select all->body select', async () => {
            vm.$children[0].dataList[0]._isDisabled = false;
            const aElemBodyCheck = vm.$el.querySelectorAll('.flex-table-body input[type="checkbox"]');
            aElemBodyCheck.forEach(async (elem: Element, index: number) => {
                triggerEvent(elem, 'click');
                vm.$children[0].$children[1].$children[0].toggleSelect(index); // 这里需要手动程序触发
                await wait(50);
            });
            const bCheck = elemAllCheckedBtn && elemAllCheckedBtn.checked;

            expect(bCheck).to.eql(true);
        });

        // 检测 没有数据时 点击全选
        it('check select all->no data', async () => {
            vm.list = [];
            await wait(100);
            triggerEvent(elemAllCheckedBtn, 'click');
            await wait(100);
            const bCheck = vm.$children[0].$children[0].$children[0].state; // 属性有问题，这里改成用组件的state判断
            expect(bCheck).to.eql(false);
        });
    });
});
