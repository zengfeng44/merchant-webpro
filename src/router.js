const routers = [
    {
        path: '/',
        meta: {
            title: '商家付款'
        },
        component: (resolve) => require(['./views/index.vue'], resolve)
    },
	{
        path: '/complete',
        meta: {
            title: '付款成功'
        },
        component: (resolve) => require(['./views/complete.vue'], resolve)
    }
];
export default routers;