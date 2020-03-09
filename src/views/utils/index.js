export function listChannel(resMap) {
  var arr = [];
  if (resMap == null || resMap.length == 0) {
    return arr;
  }
  var resVal = resMap[5];
  if (resVal == undefined) return arr;
  var resValArr = resVal.split(",");
  //循环所有排期包的channel
  outer: for (var int = 0; int < resValArr.length; int++) {
    var oneChannel = resValArr[int];
    if (oneChannel == "") continue;
    //先把二级分类遍历出 放到arr中
    for (var int2 = 0; int2 < vrs_second_list.length; int2++) {
      var sec_one = vrs_second_list[int2];
      if (sec_one.id == oneChannel && sec_one.name.toLowerCase().indexOf("tv") > -1) {
        var is_exits = false;
        for (var int3 = 0; int3 < arr.length; int3++) {
          var arrOne = arr[int3];
          if (arrOne.id == sec_one.pid) {
            is_exits = true;
            arrOne["split"].push(sec_one.id);
          }
        }
        if (!is_exits) {
          arr.push({ id: sec_one.pid, name: "", split: [sec_one.id] });
        }
        continue outer;
      }
    }
    //再把一级分类遍历出 放到arr中
    for (var int2 = 0; int2 < vrs_first_list.length; int2++) {
      var fir_one = vrs_first_list[int2];
      if (fir_one.id == oneChannel && fir_one.name.toLowerCase().indexOf("tv") > -1) {
        for (var int3 = 0; int3 < arr.length; int3++) {
          var arrOne = arr[int3];
          if (arrOne.id == fir_one.id) {
            continue outer;
          }
        }
        arr.push({ id: fir_one.id, name: fir_one.name, split: [] });
        continue outer;
      }
    }
  }
  //由于第一次遍历二级分类 只能拿到一级分类的id 没有名称,所以要再遍历一次
  named: for (var int4 = 0; int4 < arr.length; int4++) {
    var oneArr = arr[int4];
    for (var int2 = 0; int2 < vrs_first_list.length; int2++) {
      var fir_one = vrs_first_list[int2];
      if (fir_one.id == oneArr["id"]) {
        oneArr["id"] = fir_one["vid"];
        if (oneArr["name"] == "") {
          oneArr["name"] = fir_one.name;
        }
        continue named;
      }
    }
  }
  //console.debug('arr: ',arr);
  var resultArr = [];
  var idArr = [];
  for (var arrInt = 0; arrInt < arr.length; arrInt++) {
    var arrOne = arr[arrInt];
    if ($.inArray(arrOne["id"], idArr) > -1) {
      for (var int5 = 0; int5 < resultArr.length; int5++) {
        var resultOne = resultArr[int5];
        if (resultOne["id"] == arrOne["id"] && resultOne["split"].length < arrOne["split"].length) {
          resultOne["split"] = arrOne["split"];
          break;
        }
      }
    } else {
      idArr.push(arrOne["id"]);
      for (var int6 = 0; int6 < vrs_first_list.length; int6++) {
        var fir_one = vrs_first_list[int6];
        if (fir_one.vid == arrOne["id"] && fir_one.plat == 0) {
          arrOne["name"] = fir_one["name"];
          break;
        }
      }
      resultArr.push(arrOne);
    }
  }

  return resultArr;
}
