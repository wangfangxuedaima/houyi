import request from "../request";

// 获取广告模版
export function fGetBarTemplates() {
  return request({
    url: "/d/bartemplate/list",
    method: "get",
    params: { pageSize: 1000 }
  });
}

// 获取广告组
export function fGetAdgroups(agids) {
  return request({
    url: "/d/adgroup/list",
    method: "post",
    data: { idsStr: agids.join(","), pageSize: agids.length },
    dataType: "formData"
  });
}

// 获取广告
export function fGetAdvertisiments(agids, materialIds) {
  return request({
    url: "/d/advertisement/listbyagids",
    method: "post",
    data: { groupids: agids.join(","), maIds: materialIds.join(",") },
    dataType: "formData"
  });
}
