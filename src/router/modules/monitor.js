import Layout from '@/layout';
import Main from '@/layout/components/pageMain';

export default [{
    path: '/monitor',
    component: Layout,
    redirect: '/monitor/index',
    name: 'monitor',
    alwaysShow: true,
    meta: {
        title: '系统监控',
        icon: 'el-icon-s-platform'
    },
    children: [{
            path: 'market',
            name: 'market',
            component: Main,
            meta: {
                title: '监控大盘',
                icon: 'el-icon-s-grid'
            },
            children: [{
                path: 'common',
                name: 'market-common',
                component: Main,
                component: () => import('@/views/monitor/market/index'),
                meta: {
                    title: '通用大盘',
                    activeMenu: 'market-common',
                    icon: 'el-icon-star-off',
                    marketPageType: 'marketCommon'
                },
            }, {
                path: 'person',
                name: 'market-person',
                component: Main,
                component: () => import('@/views/monitor/market/index'),
                meta: {
                    title: '个人大盘',
                    activeMenu: 'market-person',
                    icon: 'el-icon-user',
                    marketPageType: 'marketPersonal'
                },
            }]
        },
        {
            path: 'realtime',
            name: 'realtime-index',
            component: () => import('@/views/monitor/realtime/index'),
            meta: {
                title: '实时监控',
                activeMenu: 'realtime-index',
                icon: 'el-icon-view'
            },
        },
        {
            path: 'police',
            name: 'police-index',
            component: () => import('@/views/monitor/police/index'),
            meta: {
                title: '报警管理',
                activeMenu: 'police-index',
                icon: 'el-icon-message'
            },
        },
    ],
}, ]