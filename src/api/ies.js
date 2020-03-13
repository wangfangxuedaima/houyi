import request from "./requestOut";
export function fGetIesHourChartData(object) {
  return request({
    url: "/iesdata/hour/chart",
    method: "get",
    params: object
  });
}

export function fGetIesDayChartData(object) {
  return request({
    url: "/iesdata/area/chart",
    method: "get",
    params: object
  });
}
