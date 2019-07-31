const routers = [
    {
        path: '/',
		name: 'home',
        meta: {
            title: '商家付款'
        },
        component: (resolve) => require(['./views/index.vue'], resolve)
    },
	{
        path: '/complete',
		name: 'complete',
        meta: {
            title: '付款成功'
        },
        component: (resolve) => require(['./views/complete.vue'], resolve)
    },
	{
        path: '/present',
		name: 'present',
        meta: {
            title: '赠送礼品值'
        },
        component: (resolve) => require(['./views/present.vue'], resolve)
    },
	{
        path: '/pay',
		name: 'pay',
        meta: {
            title: '微信支付'
        },
        component: (resolve) => require(['./views/pay.vue'], resolve)
    },
];
export default routers;