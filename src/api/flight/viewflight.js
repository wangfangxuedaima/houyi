// 用户管理路由
import request from "@/api/request";
// 获取登陆用户信息
export function getCityData() {
  return request({
    url: "/d/viewflight/searcCityFinishedcpm",
    method: "post"
  });
}
