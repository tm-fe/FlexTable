/* eslint-disable no-undef */
import { createVue, waitImmediate } from '../util';

const aTestList = [];
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
    describe('theme', () => {
        const vm = createVue({
            template: `
                <flex-table
                    resizable
                    :loading="loading" 
                    :columns="columns" 
                    :data="list"
                    :sum="sum"
                    :size="size"
                    :theme="theme"
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
                    size: '',
                    theme: '',
                };
            },
            methods: {
            },
        });

        // 检测 size-big
        it('check size-big', async() => {
            vm.size = 'big';

            await waitImmediate();
            const bBig = vm.$el.classList.contains('flex-table-big');
            expect(bBig).to.eql(true);
        });

        // 检测 size-small
        it('check size-small', async() => {
            vm.size = 'small';

            await waitImmediate();
            const bBig = vm.$el.classList.contains('flex-table-small');
            expect(bBig).to.eql(true);
        });

        // 检测 theme-dark
        it('check theme-dark', async() => {
            vm.theme = 'dark';

            await waitImmediate();
            const bBig = vm.$el.classList.contains('flex-table-dark');
            expect(bBig).to.eql(true);
        });
    });
});
