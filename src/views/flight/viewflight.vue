<template>
  <div class="page-wraper fullsize fullsize-flex viewflight-wraper">
    <top-search-bar ref="searchRef" :config="searchItems" @operate="fOperate" @fSearch="fSearch"></top-search-bar>
    <el-dialog title="北上广深完成情况" :visible.sync="dialogTableVisible" width="75%">
      <el-table :data="gridData">
        <template v-for="item in cityData">
          <el-table-column :property="item.prop" :label="item.label" width="150" :key="item.prop"></el-table-column>
        </template>
      </el-table>
    </el-dialog>
    <pagination-pro
      class="mg-t-10 grow-1"
      ref="pageRef"
      :loading.sync="bIsLoading"
      :autoload="false"
      :fullsize="true"
      :page-size="20"
      :page-sizes="[20, 50, 100, 200]"
      layout="sizes, prev, pager, next, ->, total"
      :url="'/d/viewflight/list'"
      :params="searchObject"
      :onResponse="fOnResponse"
    >
      <template v-slot="{ data, height }">
        <el-table
          v-loading="bIsLoading"
          :data="tableDate(data)"
          :max-height="height"
          @selection-change="handleSelectionChange"
          border
        >
          <el-table-column align="center" type="selection" width="40"></el-table-column>
          <el-table-column show-overflow-tooltip align="center" label="排期包ID">
            <template v-slot="{ row }">
              <router-link :to="'/flight/advproject/flightdetail/' + row.bpId">{{ row.bpId }}</router-link>
            </template>
          </el-table-column>
          <template v-for="v in columns">
            <el-table-column show-overflow-tooltip align="center" v-if="!v.hidden" v-bind="v" :key="v.prop">
              <template v-slot="{ row }">{{ row | render(v) }}</template>
            </el-table-column>
          </template>
        </el-table>
      </template>
    </pagination-pro>
    <el-dialog title="汇总项" :visible.sync="showDig" width="80%">
      <el-button type="primary" size="mini" @click="checkAll">
        全选
      </el-button>
      <el-button type="primary" size="mini" @click="cleanCheck">
        清空
      </el-button>
      <el-button type="primary" size="mini" @click="backCheck">
        反选
      </el-button>
      <el-checkbox-group v-model="showList">
        <template v-for="item in checkList">
          <el-checkbox :label="item.index" :key="item.label" class="el-checkbox-item">
            {{ item.label }}
          </el-checkbox>
        </template>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDig = !showDig">取 消</el-button>
        <el-button type="primary" @click="hasModifyToIndex" :disabled="!showList.length">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getMapData } from "@/api/dataMap";
import { getCityData } from "@/api/flight/viewflight";
import TopSearchBar from "@/components/TopSearchBar";
import { listMixins } from "@/mixins";
export default {
  name: "viewFlight",
  components: { TopSearchBar },
  mixins: [listMixins],
  data() {
    const fGetListGetterConfig = (typeName) => {
      return {
        url: "/system/basedata/list",
        params: { searchDatatype: typeName },
        keyMap: { list: "rows" },
        data: [],
        optionValue: "datavalue",
        optionName: "dataname",
        filter: (arr) => {
          return arr.filter((item) => {
            return item.status != 2;
          });
        }
      };
    };
    return {
      gridData: [],
      showList: [],
      columns: [],
      bIsLoading: false,
      dialogTableVisible: false,
      showDig: false,
      searchObject: {},
      canOperate: true,
      cityData: [
        { prop: "areaName", label: "城市" },
        { prop: "cpmcount", label: "当日预定量" },
        { prop: "cpmcountRate", label: "预定量占比" },
        { prop: "flightcpm", label: "当日投放量" },
        { prop: "finishedcpm", label: "当日完成量" },
        { prop: "finishedRate", label: "当日完成率" }
      ],
      checkList: [
        { prop: "flighttime", label: "日期", width: "150", filter: "date", hidden: true, index: 0 },
        { prop: "advname", label: "广告名称", width: "400", hidden: false, index: 1 },
        { prop: "advFlightStatusName", label: "广告状态", hidden: false, index: 2 },
        { prop: "platName", label: "平台", width: 150, hidden: false, index: 3 },
        // {
        //   prop: "area",
        //   label: "范围",
        //   width: '200'
        // },
        { prop: "appiddirect", label: "范围", width: "150", hidden: false, index: 4 },
        { prop: "projectNumber", label: "执行单号", width: 300, hidden: false, index: 5 },
        { prop: "realprice", label: "排期包单价", width: 150, filter: "fmoney", hidden: false, index: 6 },
        { prop: "projectRealprice", label: "执行单金额", width: 150, filter: "fmoney", hidden: false, index: 7 },
        { prop: "projectStarttime", label: "开始日期", width: 150, filter: "date", hidden: false, index: 8 },
        { prop: "projectEndtime", label: "结束日期", width: 150, filter: "date", hidden: false, index: 9 },
        { prop: "advertisername", label: "广告商", width: "150", hidden: false, index: 10 },
        { prop: "duration", label: "广告时长", hidden: false, index: 11 },
        { prop: "bstatusName", label: "执行单状态", width: 150, hidden: false, index: 12 },
        { prop: "hourdirectName", label: "小时定向", index: 13, hidden: false },
        { prop: "useTypeName", label: "使用属性", hidden: false, index: 14 },
        { prop: "adStyle", label: "广告形式code", width: 150, hidden: false, index: 15 },
        { prop: "adStyleName", label: "广告形式", hidden: false, index: 16 },
        { prop: "frequency", label: "频次", hidden: false, width: 280, index: 17 },
        { prop: "iscpm2", label: "CPM2属性", hidden: false, index: 18 },
        // {
        //   label: "投放优先级",
        //   prop: "priority",
        //   align: "center"
        // },
        // {
        //   label: "可调优先级",
        //   prop: "priority",
        //   width: 80,
        //   align: "center"
        // },
        { label: "定向分类", prop: "cpmResName", width: 280, align: "center", index: 19, hidden: false },
        { label: "定向地域", prop: "areaName", width: 80, align: "center", hidden: false, index: 20 },
        {
          label: "总预定量",
          prop: "cpmcount2",
          hidden: false,
          width: 80,
          align: "center",
          filter: "cpmFun",
          index: 21
        },
        {
          label: "总完成量",
          prop: "finishedcpm2",
          width: "150px",
          align: "center",
          index: 22,
          filter: "cmpFun2",
          hidden: false
        },
        { label: "整体完成率", prop: "cpmcount2Rate", width: "150px", align: "center", index: 23 },
        {
          label: "当日预定量",
          prop: "cpmcount",
          width: "150px",
          align: "center",
          index: 24,
          hidden: false,
          filter: "cpmFun"
        },
        {
          label: "当日投放量",
          prop: "flightcpm",
          width: "150px",
          align: "center",
          index: 25,
          hidden: false,
          filter: "cpmFun"
        },
        {
          label: "当日完成量",
          prop: "finishedcpm",
          width: "150px",
          align: "center",
          index: 26,
          hidden: false,
          filter: "cmpFun2"
        },
        { label: "当日完成率", prop: "flightcpmRate", width: "150px", align: "center", index: 27 },
        { label: "投放者", prop: "flightuser", width: "150px", align: "center", hidden: false, index: 28 },
        { label: "执行单级别", prop: "projectLevelName", width: 100, align: "center", hidden: false, index: 29 },
        { label: "广告id", prop: "advid", width: "150px", align: "center", hidden: false, index: 30 },
        { label: "异常流量屏蔽", prop: "abnormalFlow", width: 150, align: "center", hidden: false, index: 31 }
      ],
      searchItems: {
        labelWidth: "75px",
        hideenSearchBtn: true,
        searchButtons: [
          { name: "查询", attrs: { icon: "el-icon-search" } },
          { name: "清空" },
          { name: "设置", attrs: { icon: "el-icon-s-tools" } },
          { name: "统计", attrs: { icon: "el-icon-s-data" } },
          { name: "下载", attrs: { icon: "el-icon-download" } }
        ],
        // defaultSearch: {
        //   placeholder: "搜索内容后请敲回车键...",
        //   key: "name" // 默认的搜索字段
        // },
        searchItems: [
          {
            type: "Input",
            prop: "projectNumber",
            formItemAttrs: { label: "执行单号" },
            attrs: {
              clearable: true,
              style: "width:150px"
            }
          },
          {
            type: "Input",
            prop: "bpId",
            formItemAttrs: { label: "排期包ID" },
            attrs: { clearable: true, style: "width:150px" }
          },
          {
            type: "Input",
            prop: "advertisername",
            dataMap: "advertisername",
            default: "",
            formItemAttrs: { label: "广告主" },
            attrs: { style: "width:150px", clearable: true }
          },
          {
            type: "Select",
            prop: "projectLevel",
            dataMap: "projectLevel",
            formItemAttrs: { label: "执行单级别" },
            attrs: {
              clearable: true,
              style: "width:150px"
            },
            data: []
          },
          {
            type: "Select",
            prop: "bussinessstatus",
            dataMap: "bussinessstatus",
            formItemAttrs: { label: "执行单状态" },
            attrs: { clearable: true, style: "width:150px" },
            data: []
          },
          {
            type: "Select",
            prop: "areaName",
            dataMap: "areadirect",
            default: "",
            formItemAttrs: { label: "地域定向" },
            attrs: { clearable: true, style: "max-width:150px" },
            data: []
          },
          {
            type: "Select",
            prop: "saletype",
            dataMap: "saletype",
            formItemAttrs: { label: "售卖方式" },
            attrs: { clearable: true, style: "width:150px" },
            data: []
          },
          {
            type: "Select",
            prop: "platCodes",
            default: [],
            formItemAttrs: { label: "平台", "label-width": "50px" },
            attrs: {
              placeholder: "请选择",
              multiple: true,
              "collapse-tags": true,
              clearable: true,
              style: "max-width:180px"
            },
            listGetter: fGetListGetterConfig("plat")
          },
          {
            type: "Input",
            prop: "advertisername",
            default: "",
            formItemAttrs: { label: "广告主" },
            attrs: { style: "width:150px", clearable: true }
          },
          {
            type: "Select",
            prop: "adStyle",
            dataMap: "adstyle",
            formItemAttrs: { label: "广告形式" },
            attrs: { clearable: true, style: "width:150px" },
            data: []
          },
          {
            type: "Select",
            prop: "advFlightStatus",
            dataMap: "advFlightStatus",
            formItemAttrs: { label: "广告状态" },
            attrs: { clearable: true, style: "width:150px" },
            data: []
          },
          {
            type: "DataPicker",
            prop: "submitTime",
            startTimeKey: "starttime",
            endTimeKey: "endtime",
            formItemAttrs: { label: "起止日期", "label-width": "80px" },
            attrs: {
              clearable: true,
              style: "width:250px",
              type: "daterange",
              "start-placeholder": "开始日期",
              "end-placeholder": "结束日期",
              format: "yyyy-MM-dd",
              "value-format": "yyyy-MM-dd"
            }
          }
        ]
      }
    };
  },
  created() {
    this.showList = this.checkList.map((v) => {
      return v.index;
    });
    this.columns = this.checkList;
    this.fGetMapData([
      //获取字典表字段
      "projectLevel",
      "bussinessstatus",
      "adstyle",
      "plat",
      "advFlightStatus",
      "saletype",
      "directional_type"
    ]);
    getCityData().then((res) => {
      //城市数据展示
      let { cityFinishedcpm, cityCpmSumBook } = res;
      if (res.cityFinishedcpm.length) {
        for (var i of cityFinishedcpm) {
          this.getCityData.push({
            areaName: i.areaName,
            cpmcount: i.cpmcount * 1000,
            cpmcountRate: ((i.cpmcount * 100.0) / cityCpmSumBook.cpmcount2).toFixed(2) + "%",
            flightcpm: i.flightcpm * 1000,
            finishedcpm: i.finishedcpm,
            finishedRate: (i.finishedcpm / (i.flightcpm * 10)).toFixed(2) + "%"
          });
        }
      }
      this.gridData.push({
        areaName: "地区",
        cpmcount: cityCpmSumBook.cpmcount * 1000,
        cpmcountRate: ((cityCpmSumBook.cpmcount * 100.0) / cityCpmSumBook.cpmcount2).toFixed(2) + "%",
        flightcpm: cityCpmSumBook.flightcpm * 1000,
        finishedcpm: cityCpmSumBook.finishedcpm,
        finishedRate:
          cityCpmSumBook.flightcpm != null && cityCpmSumBook.flightcpm != 0
            ? (cityCpmSumBook.finishedcpm / (cityCpmSumBook.flightcpm * 10)).toFixed(2) + "%"
            : "无"
      });
    });
    this.fReload();
  },
  methods: {
    fGetMapData(params) {
      //从字典表获取字段
      for (let i of params) {
        getMapData(i).then((res) => {
          for (var j of this.searchItems.searchItems) {
            if (j.dataMap == i) {
              j.data = res;
            }
          }
        });
      }
    },
    tableDate(val) {
      //满足部分需要传多个参数的filter规则
      if (val.length) {
        for (var i of val) {
          i.iscpm2 = this.iscpmFun(i.iscpm2, null, i) || i.iscpm2;
          i.flightcpmRate = this.dayfinishedRateFun(i.flightcpm, null, i);
          if (i.cpmcount2 && i.finishedcpm2 !== null) {
            i.cpmcount2Rate = ((i.finishedcpm2 * 100) / (i.cpmcount2 * 1000)).toFixed(2) + "%";
          } else {
            return "0.00%";
          }
        }
      }
      return val;
    },

    dayfinishedRateFun(cellvalue, options, rowObject) {
      if (null != rowObject.finishedcpm && cellvalue != 0) {
        return (rowObject.finishedcpm / (cellvalue * 10)).toFixed(2) + "%";
      } else {
        return "0.00%";
      }
    },
    iscpmFun(cellvalue, options, rowObject) {
      var str = "";
      if (cellvalue == 1) {
        if ("" != rowObject.posDirectName && rowObject.posDirectName != "未知") {
          str = rowObject.posDirectName;
        }
        if (null != rowObject.seq && null != rowObject.num) {
          str += ",";
          if (rowObject.seq == 1 && rowObject.num == 1) {
            str += "全流量";
          } else if (rowObject.seq != 1 || rowObject.num != 1) {
            str += rowObject.seq / rowObject.num + "流量";
          }
        }
      } else if (cellvalue == 0) {
        str = "无";
      }
      return str;
    },
    backCheck() {
      //反选
      const obj = {};
      for (var i of this.showList) {
        obj[i] = true;
      }
      const len = this.checkList.length;
      let backArr = [];
      for (var j = 0; j < len; j++) {
        if (!obj[j]) {
          backArr.push(j);
        }
      }
      this.showList = backArr;
    },
    checkAll() {
      this.showList = this.checkList.map((v) => {
        return v.index;
      });
    },
    cleanCheck() {
      this.showList = [];
    },
    hasModifyToIndex() {
      //修改展示项
      if (!this.showList.length) {
        this.$alert("展示项不能为空", "错误", {
          confirmButtonText: "确定"
        });
      } else {
        for (var i of this.checkList) {
          i["hidden"] = true;
        }
        this.showList.forEach((item) => {
          if (item !== undefined) {
            this.checkList[item]["hidden"] = false;
          }
        });
        this.$nextTick(() => {
          // let str = JSON.stringify(this.checkList);
          this.columns = this.checkList;
        });
        this.showDig = false;
      }
    },
    fOperate(btn) {
      switch (btn.name) {
        case "设置":
          this.showDig = !this.showDig;
          break;
        case "统计":
          this.dialogTableVisible = !this.dialogTableVisible;
          break;
        case "下载":
          alert(333);
          break;
      }
    },
    fReload() {
      this.$nextTick(() => {
        this.$refs.pageRef.fReload();
      });
    },
    onClean() {
      for (var i in this.info) {
        this.info[i] = "";
      }
    },
    fOnResponse() {},
    fSearch(val) {
      this.searchObject = { ...val, platCodes: val.platCodes.join(",") };
      this.fReload();
    },
    onSubmit() {
      this.fReload();
    },
    handleSelectionChange() {},
    handleSelect() {}
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.filtrate {
  margin-top: 0px;
}
.el-checkbox-group {
  padding-top: 20px;
}
.el-checkbox-item {
  width: 120px;
}
</style>
