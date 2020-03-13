import request from './request'
// baseMap
export function getBaseDataMap(type) {
    return request({
        url: '/basemappingmap',
        method: 'get',
    })
}
export function getAllProvince(params) {
    return request({
        url: '/basemapping/provinces',
        method: 'get',
        params: params,
    })
}
