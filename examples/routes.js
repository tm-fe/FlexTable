export default [
    {
        path: '/',
        name: 'index',
        component: resolve => require(['./features/index.vue'], resolve),
        meta: {
            title: '普通用法',
        },
    },
    {
        path: '/autoCalWidth',
        name: 'autoCalWidth',
        component: resolve => require(['./features/autoCalWidth.vue'], resolve),
        meta: {
            title: '自动计算宽度',
        },
    },
    {
        path: '/fixedHeader',
        name: 'fixedHeader',
        component: resolve => require(['./features/fixedHeader.vue'], resolve),
        meta: {
            title: '固定头部',
        },
    },
    {
        path: '/footer',
        name: 'footer',
        component: resolve => require(['./features/footer.vue'], resolve),
        meta: {
            title: '底部汇总',
        },
    },
    {
        path: '/loading',
        name: 'loading',
        component: resolve => require(['./features/loading.vue'], resolve),
        meta: {
            title: '数据加载状态',
        },
    },
    {
        path: '/sortable',
        name: 'sortable',
        component: resolve => require(['./features/sortable.vue'], resolve),
        meta: {
            title: '排序',
        },
    },
    {
        path: '/render',
        name: 'render',
        component: resolve => require(['./features/render.vue'], resolve),
        meta: {
            title: 'Render函数',
        },
    },
    {
        path: '/fixedLeft',
        name: 'fixedLeft',
        component: resolve => require(['./features/fixedLeft.vue'], resolve),
        meta: {
            title: '固定列',
        },
    },
    {
        path: '/resizable',
        name: 'resizable',
        component: resolve => require(['./features/resizable.vue'], resolve),
        meta: {
            title: '调整宽度',
        },
    },
    {
        path: '/selectable',
        name: 'selectable',
        component: resolve => require(['./features/selectable.vue'], resolve),
        meta: {
            title: '多选/全屏固定头部',
        },
    },
    {
        path: '/expand',
        name: 'expand',
        component: resolve => require(['./features/expand.vue'], resolve),
        meta: {
            title: '展开',
        },
    },
    {
        path: '/scopedSlot',
        name: 'scopedSlot',
        component: resolve => require(['./features/scopedSlot.vue'], resolve),
        meta: {
            title: 'scoped-slot',
        },
    },
    {
        path: '/style',
        name: 'style',
        component: resolve => require(['./features/style.vue'], resolve),
        meta: {
            title: '风格样式',
        },
    },
    {
        path: '/addColor',
        name: 'addColor',
        component: resolve => require(['./features/addColor.vue'], resolve),
        meta: {
            title: '初始渲染/勾选渲染',
        },
    },
    {
        path: '/span',
        name: 'span',
        component: resolve => require(['./features/span.vue'], resolve),
        meta: {
            title: '合并',
        },
    },
];
