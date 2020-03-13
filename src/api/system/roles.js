// 角色管理路由

import request from '../request'

// 获取角色的列表, 不分页
export function fGetRoles(name) {
    let params = {
        pageNum: 1,
        pageSize: 20,
    }
    if (name) {
        params.name = name
    }
    return request({
        url: '/system/roles',
        method: 'get',
        params: params,
    })
}

// 保存角色
export function fSaveRole(params, isCreate) {
    return request({
        url: '/system/roles',
        method: isCreate ? 'put' : 'post',
        data: params,
    })
}

// 获取某个角色信息
export function fGetRoleInfo(roleId) {
    return request({
        url: `/system/roles/${roleId}`,
        method: 'get',
    })
}

// 删除角色
export function fDeleteRole(id) {
    return request({
        url: `/system/roles/${id}`,
        method: 'delete',
    })
}
