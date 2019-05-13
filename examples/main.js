// import 'babel-polyfill';
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './app.vue';

Vue.use(VueRouter);

// 开启debug模式
Vue.config.debug = true;

// 路由配置
const router = new VueRouter({
    esModule: false,
    mode: 'hash',
    routes: [
        {
            path: '/',
            component: (resolve) => require(['./features/index.vue'], resolve)
        },
        {
            path: '/fixedHeader',
            component: (resolve) => require(['./features/fixedHeader.vue'], resolve)
        },
        {
            path: '/footer',
            component: (resolve) => require(['./features/footer.vue'], resolve)
        },
        {
            path: '/loading',
            component: (resolve) => require(['./features/loading.vue'], resolve)
        },
        {
            path: '/sortable',
            component: (resolve) => require(['./features/sortable.vue'], resolve)
        },
        {
            path: '/render',
            component: (resolve) => require(['./features/render.vue'], resolve)
        },
        {
            path: '/fixedLeft',
            component: (resolve) => require(['./features/fixedLeft.vue'], resolve)
        },
        {
            path: '/resizable',
            component: (resolve) => require(['./features/resizable.vue'], resolve)
        },
        {
            path: '/selectable',
            component: (resolve) => require(['./features/selectable.vue'], resolve)
        },
    ]
});

const app = new Vue({
    router: router,
    render: h => h(App)
}).$mount('#app');