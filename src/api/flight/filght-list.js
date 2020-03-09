import request from "../request";

// 获取广告模版
export function opproconflict(data) {
  return request({
    url: "/d/proconflict/opproconflict",
    method: "post",
    dataType: "formData",
    data
  });
}

export function getAdNamelist(data) {
  return request({
    url: "/d/proconflict/getAdNamelist",
    method: "post",
    dataType: "formData",
    data
  });
}
