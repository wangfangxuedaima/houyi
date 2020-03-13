import request from './request'

export function getRealTimeLine(searchObject) {
    return request({
        url: '/realtime',
        method: 'post',
        data: searchObject,
    })
}

// Market
export function getMarketLines(params) {
    return request({
        url: '/getMarketLines',
        method: 'get',
        params: params
    })
}
export function addMarketLine(params) {
    return request({
        url: '/addMarketLine',
        method: 'post',
        data: params,
    })
}
export function deleteMarketLine(params) {
    return request({
        url: '/deleteMarketLine',
        method: 'delete',
        data: params
    })
}
