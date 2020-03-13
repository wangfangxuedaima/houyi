import Layout from '@/layout';
export default [{
        path: '/error',
        name: 'error',
        component: () => import('@/views/error'),
        hidden: true,
    }, {
        path: '/',
        name: 'home',
        component: Layout,
        redirect: '/home',
        meta: {
            title: '首页',
        },
        hidden: true,
        children: [{
            path: 'home',
            hidden: true,
            component: () => import('@/views/home'),
        }],
    },
    //{
    //     path: '*',
    //     redirect: '/error',
    //     hidden: true,
    //     realpath: '*',
    // }
]