import { createVue, waitImmediate } from '../util';

const {
    describe,
    it,
// eslint-disable-next-line no-undef
} = window;

const aTestList = [];
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
    describe('loading', () => {
        const vm = createVue({
            template: `
                <flex-table
                    :loading="loading" 
                    :columns="columns" 
                    :data="list"
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
                    loading: true,
                    list: aTestList,
                };
            },
            methods: {},
        });

        // 检测 显示loading
        it('status:true', () => {
            const elemLoading = vm.$el.querySelector('.flex-table-spinner');
            expect(!!elemLoading).to.eql(true);
        });

        // 检测 取消loading
        it('status:false', async() => {
            vm.loading = false;
            await waitImmediate();
            const elemLoading = vm.$el.querySelector('.flex-table-spinner');
            expect(!!elemLoading).to.eql(false);
        });
    });
});
