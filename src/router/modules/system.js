import Main from '@/layout/components/pageMain';
import Layout from '@/layout/index';

export default [{
    path: '/system',
    component: Layout,
    redirect: '/system/users/index',
    name: 'system',
    alwaysShow: true,
    meta: {
        title: '系统管理',
        icon: 'el-icon-setting',
    },
    children: [{
            path: 'users',
            component: Main,
            name: 'users',
            redirect: '/system/users/index',
            children: [{
                    path: 'index',
                    name: 'users-index',
                    component: () => import('@/views/system/users/index'),
                    meta: {
                        title: '用户管理',
                        activeMenu: 'users',
                        icon: 'el-icon-s-custom',
                    },
                },
                {
                    path: 'create',
                    name: 'users-create',
                    hidden: true,
                    component: () => import('@/views/system/users/create'),
                    meta: {
                        title: '新增用户',
                        activeMenu: 'users',
                        action: 'create',
                    },
                },
                {
                    path: 'edit/:id',
                    name: 'users-edit',
                    hidden: true,
                    component: () => import('@/views/system/users/create'),
                    meta: {
                        title: '修改用户信息',
                        activeMenu: 'users',
                        action: 'edit',
                    },
                },
            ],
        },
        {
            path: 'roles',
            component: Main,
            name: 'roles',
            redirect: '/system/roles/index',
            children: [{
                    path: 'index',
                    name: 'roles-index',
                    component: () => import('@/views/system/roles/index'),
                    meta: { title: '角色管理', icon: 'el-icon-s-custom', activeMenu: 'roles', },
                },
                {
                    path: 'create',
                    name: 'roles-create',
                    hidden: true,
                    component: () => import('@/views/system/roles/create'),
                    meta: {
                        title: '新增角色',
                        activeMenu: 'roles',
                        action: 'create',
                    },
                },
                {
                    path: 'edit/:id',
                    name: 'roles-edit',
                    hidden: true,
                    component: () => import('@/views/system/roles/create'),
                    meta: {
                        title: '修改角色信息',
                        activeMenu: 'roles',
                        action: 'edit',
                    },
                },
            ],
        },
        {
            path: 'modules',
            component: Main,
            name: 'modules',
            redirect: '/system/modules/index/-1',
            children: [{
                    path: 'index/:id',
                    name: 'module-index',
                    component: () => import('@/views/system/modules/index'),
                    meta: { title: '模块管理', icon: 'el-icon-menu', activeMenu: 'modules', },
                },
                {
                    path: 'create/:id',
                    name: 'modules-create',
                    hidden: true,
                    component: () => import('@/views/system/modules/create'),
                    meta: {
                        title: '新增模块',
                        activeMenu: 'modules',
                        action: 'create',
                    },
                },
                {
                    path: 'edit/:id',
                    name: 'modules-edit',
                    hidden: true,
                    component: () => import('@/views/system/modules/create'),
                    meta: {
                        title: '修改模块信息',
                        activeMenu: 'modules',
                        action: 'edit',
                    },
                },
            ],
        },
    ],
}]
