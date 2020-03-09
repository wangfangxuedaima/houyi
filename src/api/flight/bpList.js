import request from "../request";

// 排期包列表请求API
export function fgetAdstyle() {
  return request({
    url: "d/adstyle/all",
    method: "get"
  });
}
export function fgetTime() {
  return request({
    url: "d/basedata/allAdTime",
    method: "get"
  });
}

// export function getPkgDirectList(data) {
//   return request({
//     url: "d/basedata/allAdTime",
//     method: "post",
//     data
//   });
// }
//  获取全部的平台
export function getPlatList() {
  return request({
    url: "d/plat/all",
    method: "get"
  });
}

// 获取全部的模板
export function getTemplates() {
  return request({
    url: "/d/godtemplate/listAll",
    method: "post"
  });
}

export function fGetadvbookpkg(params) {
  return request({
    url: "d/advbookpkg/list",
    method: "post",
    dataType: "formData",
    params
  });
}

export function saveGroup(data) {
  return request({
    url: "d/adgroup/manualEdit",
    method: "post",
    dataType: "formData",
    data
  });
}

export function getPkgDirectList(_id, ids) {
  return request({
    url: "d/advproject/getDirects",
    method: "post",
    dataType: "formData",
    data: {
      _id,
      ids
    }
  });
}
