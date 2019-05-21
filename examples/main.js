// import 'babel-polyfill';
import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
import App from './app.vue';
import FlexTable from '../index.js';

Vue.use(VueRouter);
Vue.use(FlexTable);

// 开启debug模式
Vue.config.debug = true;

// 路由配置
const router = new VueRouter({
    esModule: false,
    mode: 'hash',
    routes,
});

const app = new Vue({
    router,
    render: h => h(App),
}).$mount('#app');
