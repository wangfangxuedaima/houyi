import { parseTime } from "@/utils/index";
export const date = (val) => {
  if (!val) {
    return "";
  }
  return parseTime(val, "{y}-{m}-{d}");
};

export const time = (val) => {
  if (!val) {
    return "";
  }
  return parseTime(val);
};

export const fmoney = (s, n) => {
  n = n > 0 && n <= 20 ? n : 2;
  s = s / 100;
  s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";

  var l = s
    .split(".")[0]
    .split("")
    .reverse();
  const r = s.split(".")[1];
  var t = "";
  for (var i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? "," : "");
  }
  return (
    t
      .split("")
      .reverse()
      .join("") +
    "." +
    r
  );
};

export const cpmFun = (cellvalue) => {
  var s = cellvalue * 1000 + "";
  var l = s
      .split(".")[0]
      .split("")
      .reverse(),
    t = "";
  for (var i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? "," : "");
  }
  return t
    .split("")
    .reverse()
    .join("");
};

export const cmpFun2 = (cellvalue, options, rowObject) => {
  var s = cellvalue + "";
  var l = s
      .split(".")[0]
      .split("")
      .reverse(),
    t = "";
  for (var i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? "," : "");
  }
  return t
    .split("")
    .reverse()
    .join("");
};

export const array = (val) => {
  if (!val || !Array.isArray(val) || val.length === 0) {
    return "";
  }
  return val.join(",");
};

export const string = (val) => {
  if (val == null || val === "") {
    return "";
  }
  if (typeof val === "object") {
    return val.toString();
  }
  return val;
};
export const boolean = (val) => {
  if (![0, 1].includes(val)) {
    return "";
  }
  if (val) {
    return "是";
  } else {
    return "否";
  }
};
export const email = (val) => {
  if (!val) {
    return "";
  }
  return `${val}@sohu-inc.com`;
};

export const toPercent = (val) => {
  if (!val) {
    return "";
  }
  return `${Number(val * 100).toFixed(2)}%`;
};
/** ------------投放管理------------- */

/**投放管理 */
// 执行单状态
export const advprojectStatus = (val) => {
  if (!val) {
    return "未知状态";
  }
  let statusMap = {
    0: "新增",
    1: "修改",
    2: "待审核",
    3: "审核未通过",
    4: "审核通过",
    5: "执行中",
    6: "执行完成",
    8: "取消"
  };
  return statusMap[val];
};
//执行单类型
export const advprojectType = (val) => {
  if (!val) {
    return "整单video";
  }
  let statusMap = {
    1: "硬广",
    2: "赞助"
  };
  return statusMap[val];
};

export const usetype = (tp) => {
  let result = "";
  if (tp == 1) {
    result = "售卖";
  } else if (tp == 2) {
    result = "配送";
  } else if (tp == 3) {
    result = "补偿";
  } else if (tp == 4) {
    result = "推广";
  } else if (tp == 5) {
    result = "补量";
  }
  return result;
};
/** 广告组 */
//投放状态
export const flightstatusFilter = (val) => {
  let statusMap = {
    0: "未投放",
    1: "投放中",
    2: "预投放",
    3: "投放暂停",
    4: "终止投放",
    5: "<p style='color:green'>投放成功</p>",
    6: "<p style='color:orange'>投放正在进行</p>",
    7: "<p style='color:red'>投放未成功</p>",
    8: "<p style='color:red'>审核拒绝</p>",
    9: "<p style='color:red'>已提交</p>",
    10: "<p style='color:red'>投放完成</p>",
    11: "待审核",
    12: "审核通过",
    13: "审核不通过"
  };
  return statusMap[val] || "";
};

// 广告时长
export const secondFilter = (val) => {
  if (!val || val == "") return "-";
  return val + " 秒";
};
