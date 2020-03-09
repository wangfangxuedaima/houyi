// 用户管理路由
import request from "../request";

// 获取登陆用户信息
export function getSystemUserInfo() {
  return request({
    url: "/system/user/interface",
    method: "get"
  });
}

// 获取登陆用户header
export function getSystemUserMenu() {
  return request({
    url: "/interface/menu/header",
    method: "post"
  });
}
