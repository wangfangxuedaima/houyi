// 用户管理路由
import request from "@/api/request";
// 获取登陆用户信息
export function getMapData(val) {
  return request({
    url: "/d/basedata/list",
    method: "post",
    data: {
      datatype: val
    },
    dataType: "formData"
  });
}
