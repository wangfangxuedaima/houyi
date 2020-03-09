import { parseTime } from "@/utils/index";

// 搜索栏地域搜索处理
export function fDealSearchAreas(arr) {
  let dealArr = arr.map((item) => {
    let copyItem = { ...item };
    if (copyItem.cname == null || copyItem.cname == "") {
      copyItem.result = copyItem.nname;
      copyItem.data = copyItem.nname;
    } else {
      copyItem.result = copyItem.cname;
      copyItem.data = copyItem.cname;
    }
    if (copyItem.ncode == "CN") {
      copyItem.value = copyItem.ccode;
    } else {
      copyItem.value = copyItem.ncode;
    }
    return copyItem;
  });
  return dealArr;
}
//小时/分钟定向
export function hdNameFormatter(rowObject) {
  let hd = rowObject.hourdirect;
  let md = rowObject.minuteDirect;
  if (hd == undefined || hd == null) hd = "";
  if (md == undefined || md == null) md = "";
  if (hd == "" && md == "") return "-";
  let hdResult = [];
  if (hd) {
    hd.split(",").forEach((i, v) => {
      hdResult.push(v - 1);
    });
  }
  return `小时: ${hdResult.join(",")};分钟: ${md}`;
}
//投放时间
export function flightDateFormatter(rowObject) {
  if (rowObject.starttime && rowObject.endtime) {
    return `${parseTime(rowObject.starttime, "{y}-{m}-{d}")}
               ~ ${parseTime(rowObject.endtime, "{y}-{m}-{d}")}`;
  }
  return "";
}
//预定量
export function allcountFomatter(rowObject) {
  let res = "0";
  if (rowObject.allcount != null) {
    res = rowObject.allcount;
  }
  if (rowObject.mendBookpackages != null) {
    res += "&nbsp;<span class='green_tip'>" + rowObject.allMendcount + "</span>";
  }
  return res;
}
