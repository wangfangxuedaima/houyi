import request from './request'
export function login() {
    return request({
        url: '/login/callback',
        method: 'post',
        data: {
            ticket: `cXdIaWJGREROUW80TjBZcWizT/exXgYF4aCeCfnXAmoL/BBThjjq0HXQumq0utbCJ5fEUF6n444P
ZRsufoDGrQ==`,
            appid: '78401273-f7b5-42fd-866f-3d2c80b0ebc8'
        },
    })
}

export function loginOut() {
    return request({
        url: '/login/callback',
        method: 'get',
        params: {
            appid: '78401273-f7b5-42fd-866f-3d2c80b0ebc8'
        },
    })
}
