const routers = [
    {
        path: '/',
        meta: {
            title: '商家付款'
        },
        component: (resolve) => require(['./views/index.vue'], resolve)
    }
];
export default routers;