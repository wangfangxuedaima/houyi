<template>
  <div class="page-wraper flightinfo-wraper">
    <top-search-bar ref="searchRef" :config="searchList" @fSearch="fSearch"></top-search-bar>
    <div class="tables-wraper">
      <div class="info-tables" v-for="(table, index) in tableList" :key="index">
        <section class="section">{{ table.title }}</section>
        <el-table :data="packageData | dataFliter(table)" border>
          <el-table-column
            v-for="column in table.columns"
            align="center"
            v-bind="column"
            :key="column.prop"
          >
            <template slot-scope="{row}">
              <el-popover
                v-if="column.popover"
                placement="top-start"
                :title="column.popover.title"
                width="200"
                trigger="hover"
                :content="packageData[table.prop][0][column.popover.prop]"
              >
                <div slot="reference">{{row | render(column)}}</div>
              </el-popover>
              <div v-else>{{row | render(column)}}</div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="packageData[table.prop] 
        && packageData[table.prop].length > table.pageCount && table.pagination"
          background
          class="table-pagination"
          @current-change="(value) => fChangePage(value, index)"
          :current-page="table.currentPage"
          :page-size="table.pageCount"
          layout="prev, pager, next"
          :total="packageData[table.prop] && packageData[table.prop].length"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import TopSearchBar from "@/components/TopSearchBar";
import { fGetPackageInfo } from "@/api/flight";
export default {
  components: { TopSearchBar },
  data() {
    return {
      searchList: {
        // cardShadow: 'none',
        labelWidth: "100px",
        hideenSearchBtn: true,
        // searchNoImmediate: true,
        searchButtons: [
          {
            name: "查询",
            isPlain: true,
            icon: "el-icon-search",
            type: "primary"
          }
        ],
        searchItems: [
          {
            type: "Input",
            prop: "pkgId",
            formItemAttrs: { label: "排期包Id", "label-width": "80px" },
            attrs: { clearable: true, style: "max-width:140px" }
          },
          {
            type: "Select",
            prop: "advFlightTime",
            formItemAttrs: { label: "广告投放时间" },
            attrs: { clearable: true, style: "max-width:140px" },
            data: [],
            filterable: true
          }
        ]
      },
      searchObj: {},
      packageData: {},
      tableList: [
        {
          title: "执行单信息",
          prop: "projectInfo",
          columns: [
            { prop: "projectId", label: "执行单Id", width: 100 },
            { prop: "projectNum", label: "执行单号", "min-width": 300 },
            { prop: "consumerName", label: "直客客户", width: 200 },
            { prop: "projectStartTime", label: "开始时间", "min-width": 200, filter: "time" },
            { prop: "projectEndTime", label: "结束时间", "min-width": 200, filter: "time" }
          ]
        },
        {
          title: "排期包信息",
          prop: "packageInfo",
          columns: [
            { prop: "packageId", label: "排期包Id", width: 100 },
            { prop: "saletypeStr", label: "售卖方式", width: 100 },
            { prop: "unionsettings", label: "联盟设置", width: 120 },
            { prop: "pdbtype", label: "DSP设置", width: 100 },
            { prop: "platStr", label: "平台", "min-width": 120 },
            { prop: "adstyleStr", label: "广告形式", "min-width": 200 },
            { prop: "flightTime", label: "投放时间", "min-width": 200 },
            { prop: "antRuleStr", label: "异常流量屏蔽", "min-width": 200 }
          ]
        },
        {
          title: "定向信息",
          prop: "directionInfo",
          columns: [
            {
              prop: "areaDirect",
              label: "地域定向包含",
              popover: { title: "包含城市", prop: "areaDirectNames" },
              "min-width": 200
            },
            {
              prop: "excareaDirect",
              label: "地域定向排除",
              popover: { title: "排除城市", prop: "excareaDirectNames" },
              "min-width": 200
            },
            { prop: "hourDirect", label: "小时定向", "min-width": 200 },
            { prop: "minuteDirect", label: "分钟定向", "min-width": 200 },
            { prop: "contentDirect", label: "区域定向", width: 80 },
            { prop: "operatorsDirect", label: "运营商定向", "min-width": 200 }
          ]
        },
        {
          title: "预定/投放/完成量",
          prop: "books",
          pagination: true,
          pageCount: 10,
          currentPage: 1,
          columns: [
            { prop: "bookdate", label: "日期", "min-width": 120 },
            { prop: "cpmcount", label: "每日预定量", "min-width": 200 },
            { prop: "flightcpm", label: "每日投放量", "min-width": 200 },
            { prop: "finishedcpm", label: "每日完成量", "min-width": 200 }
          ]
        },
        {
          title: "广告信息",
          prop: "advflights",
          pagination: true,
          pageCount: 10,
          currentPage: 1,
          columns: [
            { prop: "flighttime", label: "投放时间", "min-width": 100 },
            { prop: "advid", label: "广告id", "min-width": 100 },
            { prop: "flightId", label: "flightid", "min-width": 120 },
            { prop: "materialName", label: "素材", "min-width": 150 },
            { prop: "duration", label: "广告时长", "min-width": 100 },
            { prop: "bartempletName", label: "广告模板", "min-width": 150 },
            { prop: "frequencyInfo", label: "频次信息", "min-width": 200 },
            { prop: "exposemointor", label: "曝光监测", "min-width": 500 },
            { prop: "clickmointor", label: "点击监测", "min-width": 200 },
            { prop: "clickurl", label: "点击跳转地址", "min-width": 500 },
            { prop: "appjumpmaddr", label: "app跳转地址", "min-width": 200 }
          ]
        }
      ]
    };
  },
  created() {},
  filters: {
    dataFliter: function(packageData, table) {
      let list = packageData[table.prop];
      if (!list) {
        return [];
      }
      if (!table.pagination || list.length < 10) {
        return list;
      }
      let begin = (table.currentPage - 1) * table.pageCount;
      let end = begin + table.pageCount;
      return list.slice(begin, end);
    }
  },
  methods: {
    fSearch(emitSearchVal) {
      if (emitSearchVal.pkgId !== this.searchObj.pkgId) {
        emitSearchVal.advFlightTime = "";
        this.fSetDate([]);
        this.tableList.forEach((table, index) => {
          this.tableList[index].currentPage = 1;
        });
      }
      fGetPackageInfo(emitSearchVal).then((res) => {
        this.packageData = {
          ...res.data,
          advflights: emitSearchVal.advFlightTime ? res.data.advflights.slice(1) : res.data.advflights
        };
        this.fSetFlightSearchList(this.packageData.advflights, emitSearchVal);
        this.searchObj = emitSearchVal;
      });
    },
    fSetFlightSearchList(advflights, emitSearchVal) {
      let times = this.searchList.searchItems[1].data;
      if (advflights && advflights.length > 0 && times.length === 0) {
        let flightTimeSeachList = advflights.map((item) => {
          return {
            datavalue: item.flighttime,
            dataname: item.flighttime
          };
        });
        flightTimeSeachList.unshift({
          datavalue: "",
          dataname: "全部"
        });
        this.fSetDate(flightTimeSeachList);
      }
    },
    fSetDate(data, hidden) {
      this.$refs.searchRef.fSetSearchItemAttr(["advFlightTime"], "data", data);
    },
    fChangePage(value, index) {
      this.tableList[index].currentPage = value;
    },
    fFlightTimeChange(curTable) {
      let searchModel = curTable.searchModel;
    }
  }
};
</script>
<style lang="scss">
.flightinfo-wraper {
  min-width: 1100px;
  .top-search-bar {
    position: fixed;
    width: 1120px;
    z-index: 99;
    margin-top: -20px;
  }
  .el-table .cell {
    white-space: pre-line;
  }
  .tables-wraper {
    padding-top: 55px;
  }
  .section {
    padding: 10px 0;
    color: #409eff;
    font-weight: 500;
    font-size: 18px;
    .flight-time {
      margin-left: 10px;
      vertical-align: 3px;
    }
  }
  .table-pagination {
    text-align: center;
    padding: 10px 0;
  }
}
</style>
