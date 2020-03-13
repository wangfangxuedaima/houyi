// 模块管理路由
import request from '../request'

// 加载模块，主要用于角色管理模块列表的显示
export function fGetModulesTree(params) {
    return request({
        url: '/system/modules/all/tree',
        method: 'get',
        params,
    })
}

// 删除模块
export function fDelModules(params) {
    return request({
        url: `/system/modules/${params.id}`,
        method: 'delete',
    })
}

// 新增/修改模块时的保存接口
export function fSaveModule(params, bIsCreate) {
    return request({
        url: '/system/modules',
        method: bIsCreate ? 'put' : 'post',
        data: params,
    })
}

// 查询一个模块的详细信息
export function fGetModuleInfo(moduleId) {
    return request({
        url: `/system/modules/${moduleId}`,
        method: 'get',
    })
}
