import Layout from '@/layout/index';

export default [{
    path: '/probleminvest',
    component: Layout,
    redirect: '/probleminvest/index',
    name: 'probleminvest',
    alwaysShow: true,
    meta: {
        title: '问题排查',
        icon: 'el-icon-warning'
    },
    children: [{
            path: 'flowfunnel',
            name: 'flowfunnel',
            component: () => import('@/views/problemInvest/flowfunnel'),
            meta: {
                title: '流量漏斗',
                activeMenu: 'flowfunnel',
                icon: 'el-icon-attract'
            },
        },
        {
            path: 'flightsearch',
            name: 'flightsearch',
            title: '投放排查',
            component: () => import('@/views/problemInvest/flightSearch'),
            meta: {
                title: '投放排查',
                activeMenu: 'flightsearch',
                icon: 'el-icon-help'
            },
        },
    ],
}, ]