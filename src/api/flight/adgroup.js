import request from "../request";

// 获取执行单信息
export function fGetProjectInfo(id) {
  return request({
    url: "/d/advproject/list",
    method: "get",
    params: { id: id }
  });
}
// 广告信息
export function fGetAdvInfo(groupId) {
  return request({
    url: "/d/advertisement/list",
    method: "get",
    params: {
      groupid: groupId,
      _search: false
    }
  });
}

// 预投放请求
export function fFlightPreview(advid) {
  return request({
    url: "/d/advflight/preview",
    method: "get",
    params: {
      advid: advid
    }
  });
}

// 新建广告
export function fAddAdv(advList) {
  return request({
    url: "/d/advertisement/saveEmptyAd",
    method: "post",
    data: {
      saveAdBoArray: JSON.stringify(advList),
      advids: ""
    },
    dataType: "formData"
  });
}

// 本单复制
export function fCoppyInner(data) {
  return request({
    url: "/d/advertisement/copyad",
    method: "post",
    data: data,
    dataType: "formData"
  });
}
// 跨单复制
export function fCoppyOutter(data) {
  return request({
    url: "/d/advertisement/crossCopyad",
    method: "post",
    data: data,
    dataType: "formData"
  });
}

// 检查广告组状态
export function fCheckAdGroupStatus(adgroupIds) {
  return request({
    url: "/d/adgroup/checkAdGroupStatus",
    method: "post",
    data: {
      adgroupIds: adgroupIds
    },
    dataType: "formData"
  });
}

// 广告组操作
export function fOperateAdgroup(type, idStr) {
  let opUrlMap = {
    stop: "/d/advflight/stop",
    suspend: "/d/advflight/suspend"
  };
  return request({
    url: opUrlMap[type],
    method: "get",
    params: {
      groupids: idStr
    }
  });
}

// 删除
export function fDeleteAdgroup(data) {
  return request({
    url: "/d/adgroup/del",
    method: "post",
    data: data,
    dataType: "formData"
  });
}

// 删除
export function fCancelAdgroupConflict(idstr) {
  return request({
    url: "/d/conflictad/cancel",
    method: "post",
    data: {
      idsStr: idstr
    },
    dataType: "formData"
  });
}

//设置广告备注
export function fAddAdvNote(data) {
  return request({
    url: "/d/adgroup/updateAdNote",
    method: "post",
    data: data,
    dataType: "formData"
  });
}

//下载导入模版
export function fDownExportTemplate(advids) {
  return request({
    url: "/d/advertisement/exportMonitorData",
    method: "post",
    data: { advids: advids },
    dataType: "formData"
  });
}

//批量导出监测
export function fDownDetectionTemplate(advids) {
  return request({
    url: "/d/advertisement/downloadTemplate",
    method: "post",
    data: { advids: advids },
    dataType: "formData"
  });
}

//监测地址监测
export function fValidMonitorData() {
  return request({
    url: "/d/advertisement/viladateMonitorData",
    method: "post",
    // data: { advids: advids },
    dataType: "formData"
  });
}

//监测地址保存
export function fValidMonitorDataSave() {
  return request({
    url: "/d/advertisement/saveData",
    method: "post",
    data: { changeFlag: false },
    dataType: "formData"
  });
}

//投放检查请求
export function fCheckFlightStatus(adgids) {
  return request({
    url: "/d/advertisement/check4flight",
    method: "post",
    data: { adgids: adgids },
    dataType: "formData"
  });
}
//是否要设置冲突广告组
export function fCheckConflictAdgroup(adgids) {
  return request({
    url: "/d/advflight/getAdvGroupSameBpk",
    method: "post",
    data: { groupids: adgids },
    dataType: "formData"
  });
}

//更新投放
export function fFlightAdgroup(adgids) {
  return request({
    url: "/d/advflight/flight",
    method: "get",
    params: { groupids: adgids }
  });
}
// 设置冲突广告组
export function setConflictAd(adgroups) {
  return request({
    url: "/d/advflight/setConflictAdGroup",
    method: "post",
    data: { adgroupArray: JSON.stringify(adgroups) },
    dataType: "formData"
  });
}

//新建修改冲突广告组
export function fSaveOrUpdateConfict(data, type) {
  let opUrlMap = {
    update: "/d/conflictad/updateconflict",
    add: "/d/conflictad/addconflict"
  };
  return request({
    url: opUrlMap[type],
    method: "post",
    data: data,
    dataType: "formData"
  });
}

// 新建频次
export function fAddFreq(freqObj) {
  return request({
    url: "/d/frequencty/save",
    method: "post",
    data: freqObj,
    dataType: "formData"
  });
}

// 保存频次
export function fSaveFreq(groupIds, freqIds) {
  return request({
    url: "/d/adgroup/batchUpdateGroupFreqs",
    method: "post",
    data: { adGroupIds: groupIds, freqIds: freqIds },
    dataType: "formData"
  });
}

// 删除频次
export function fDelFreq(groupId, freqId) {
  return request({
    url: "/d/adgroup/delGroupFrequencyByGidAndFid",
    method: "post",
    data: { gid: groupId, freqId: freqId },
    dataType: "formData"
  });
}
