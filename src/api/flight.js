import request from "./request";

// 获取单个用户信息
export function fGetPackageInfo(params) {
  return request({
    url: "flight/pkgflightinfo",
    method: "get",
    params: params
  });
}

// 获取Adcode信息
export function fGetAdcodeInfo(params) {
  return request({
    url: "flight/adcodeinfo",
    method: "get",
    params: params
  });
}
/** --------ies部分接口----------- */
// 获取ies实时监控数据
export function fGetRealTimeLine(params) {
  return request({
    url: "flight/adcodeinfo",
    method: "get",
    params: params
  });
}
