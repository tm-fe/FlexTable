import FlexTable from './src/table.vue';

const install = function (Vue) {
    Vue.component('flex-table', FlexTable);
};

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default { install, FlexTable };
export { install, FlexTable };
