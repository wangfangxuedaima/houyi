import request from './request'

export function getAdplusList(params) {
    return request({
        url: 'adplus/adplusList',
        method: 'get',
        params
    })
}
