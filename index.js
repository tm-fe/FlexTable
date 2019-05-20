import FlexTable from './src/table.vue';

const install = function (Vue) {
    Vue.component('flex-table', FlexTable);
};

export default { install, FlexTable };
export { install, FlexTable };
