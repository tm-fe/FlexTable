import { createVue, triggerEvent, waitImmediate } from '../util';

const aTestList = [];
for(let i=0;i<5;i++){
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
    describe('sortable', () => {
        const vm = createVue({
            template: `
                <flex-table
                    resizable
                    :loading="loading" 
                    :columns="columns" 
                    :data="list"
                    :sum="sum"
                    @on-sort-change="onSortChange"
                ></flex-table>
            `,
            data(){
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
                    sum:{
                        name: 'Jim Green',
                        age: 24,
                        address: 'London',
                        date: '2016-10-01',
                    },
                }
            },
            methods: {
                onSortChange(obj) {
                    const sKey = obj.key;
                    const sOrder = obj.order;
                    const aList = this.list.sort( (item1,item2) => {
                        if (sOrder === 'desc') {
                            return item2[sKey] - item1[sKey];
                        } else {
                            return item1[sKey] - item2[sKey];
                        }
                    });
                    this.list = aList;
                },
            }
        });

        const aHeadAgeSort = vm.$el.querySelectorAll('.flex-table-head .flex-table-col:nth-child(2) .flex-table-sort i');

        // 检测 倒叙
        it('check desc', async() => {
            triggerEvent(aHeadAgeSort[1],'click');
            let aDescList = JSON.parse(JSON.stringify(aTestList));
            aDescList = aDescList.sort( (item1, item2) => {
                return item2.age - item1.age;
            });

            const aTestData = [];
            aDescList.forEach((item) => {
                for (const k in item) {
                    aTestData.push(item[k].toString()); 
                }
            });
            
            await waitImmediate();

            const aBodyRow = vm.$el.querySelectorAll('.flex-table-body .flex-table-row');
            const aBodyData = [];
            aBodyRow.forEach( (node) => {
                const aCol = node.querySelectorAll('.flex-table-col');
                aCol.forEach( (elem) => {
                    aBodyData.push(elem.textContent);
                });
            });
            expect(aBodyData).to.eql(aTestData);
        });

        // 检测 倒叙
        it('check asc', async() => {
            triggerEvent(aHeadAgeSort[0],'click');
            let aDescList = JSON.parse(JSON.stringify(aTestList));
            aDescList = aDescList.sort( (item1, item2) => {
                return item1.age - item2.age;
            });

            const aTestData = [];
            aDescList.forEach((item) => {
                for (const k in item) {
                    aTestData.push(item[k].toString()); 
                }
            });
            
            await waitImmediate();

            const aBodyRow = vm.$el.querySelectorAll('.flex-table-body .flex-table-row');
            const aBodyData = [];
            aBodyRow.forEach( (node) => {
                const aCol = node.querySelectorAll('.flex-table-col');
                aCol.forEach( (elem) => {
                    aBodyData.push(elem.textContent);
                });
            });
            expect(aBodyData).to.eql(aTestData);
        });
    });
});