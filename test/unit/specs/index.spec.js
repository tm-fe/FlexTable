import { createVue } from '../util';

const aTestList = [];
const aTestData = [];
for(let i=0;i<10;i++){
    const oTestData = {
        name: 'John Brown',
        age: 18,
        address: 'New York No. 1 Lake Park',
        date: '2016-10-03',
    };
    aTestList.push(oTestData);
    for (const k in oTestData) {
        aTestData.push(oTestData[k].toString()); 
    }
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
            data(){
                return {
                    columns: [
                        {
                            title: 'Name',
                            key: 'name',
                        },
                        {
                            title: 'Age',
                            key: 'age'
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
            }
        });
        

        // 检测头部
        it('check head', (done) => {
            const aHead = vm.$el.querySelectorAll('.flex-table-head .flex-table-col>span');
            const aHeadTitle = [];
            aHead.forEach(function(node){
                aHeadTitle.push(node.textContent);
            });
            expect(aHeadTitle).to.eql(['Name', 'Age', 'Address', 'Date']);
            done();
        });

        // 检测 输入的内容
        it('check body', (done) => {
            const aBodyRow = vm.$el.querySelectorAll('.flex-table-body .flex-table-row');
            const aBodyData = [];
            aBodyRow.forEach( (node) => {
                const aCol = node.querySelectorAll('.flex-table-col');
                aCol.forEach( (elem) => {
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
            aFootRow.forEach( (node) => {
                const aDoms = node.querySelectorAll('p');
                aFootValue.push(aDoms[0].textContent);
                aFootLabel.push(aDoms[1].textContent);
            });
            expect(aFootValue).to.eql(['Jim Green','24','London','2016-10-01']);
            expect(aFootLabel).to.eql(['Name','Age','Address','Date']);
            done();
        });
    });
});
