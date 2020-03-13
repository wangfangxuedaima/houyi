// 用户管理路由
import request from '../request'

// 获取登陆用户信息
export function getUserInfo() {
    return request({
        url: '/system/user',
        method: 'get',
    })
}

// 保存用户信息
export function fSaveUser(params, bIsCreate) {
    return request({
        url: '/system/users',
        method: bIsCreate ? 'put' : 'post',
        data: params,
    })
}

// 删除用户
export function fDeleteUser(params) {
    return request({
        url: `/system/users/${params.id}`,
        method: 'delete',
    })
}

// 获取单个用户信息
export function fGetUserInfo(userId) {
    return request({
        url: `/system/users/${userId}`,
        method: 'get',
    })
}
