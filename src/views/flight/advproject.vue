<template>
  <div class="page-wraper fullsize fullsize-flex advproject-page">
    <top-search-bar ref="searchRef" :config="searchItems" @fSearch="fSearch"></top-search-bar>
    <pagination-pro
      class="mg-t-10 grow-1"
      ref="pageRef"
      :loading.sync="bIsLoading"
      :autoload="false"
      :fullsize="true"
      :page-size="15"
      :url="'/d/advproject/list'"
      :params="searchObject"
    >
      <template slot-scope="{ data, height }">
        <el-table
          v-loading="bIsLoading"
          :data="data"
          :height="height"
          header-cell-class-name="table-header"
          @row-click="fClickRow"
          :row-class-name="tableRowClassName"
          border
        >
          <el-table-column
            align="center"
            show-overflow-tooltip
            v-for="column in columns"
            v-bind="column"
            :key="column.prop"
          >
            <template slot-scope="{ row }">
              <span v-if="!column.link">{{ row | render(column) }}</span>
              <router-link v-else :to="{ path: column.link, query: { projectid: row.id } }" class="link">
                {{ row | render(column) }}
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </pagination-pro>
    <el-row v-if="curentSelect" class="bottom-info">
      <el-col v-for="(item, index) in bottomProjectInfos" :key="index" :span="8">
        <span class="label">{{ item.label }}:</span>
        <span class="value">{{ curentSelect[item.prop] }}</span>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import TopSearchBar from "@/components/TopSearchBar";
import { listMixins } from "@/mixins/index";
export default {
  mixins: [listMixins],
  components: { TopSearchBar },
  data() {
    return {
      curentSelect: "",
      bIsLoading: false,
      searchObject: {},
      columns: [
        { prop: "id", label: "执行单ID", "min-width": 80 },
        { prop: "number", label: "执行单号", "min-width": 180 },
        { prop: "showName", label: "执行单名称", "min-width": 180, link: "/flight/advproject/adgroup/list" },
        { prop: "bussinessstatus", label: "状态", "min-width": 120, filter: "advprojectStatus" },
        { prop: "starttime", label: "开始时间", "min-width": 110, filter: "date" },
        { prop: "endtime", label: "结束时间", "min-width": 110, filter: "date" },
        { prop: "type", label: "类型", "min-width": 120, filter: "advprojectType" },
        { prop: "advertisername", label: "直客客户", "min-width": 130 },
        { prop: "version", label: "版本", "min-width": 80 }
      ],
      bottomProjectInfos: [
        { label: "执行单名称", prop: "number" },
        { label: "执行单ID", prop: "id" },
        { label: "第三方监测公司", prop: "dcNames" },
        { label: "广告主", prop: "advertisername" },
        { label: "投放人", prop: "flightuser" }
      ],
      searchItems: {
        labelWidth: "75px",
        hideenSearchBtn: true,
        topButtons: [
          {
            name: "执行单冲突",
            pemissionUrl: "/p/proconflict/list",
            routerLink: "/flight/advproject/proconflict"
          },
          {
            name: "查看投放表",
            pemissionUrl: "/p/viewflight/view",
            routerLink: "/flight/advproject/viewflight"
          }
        ],
        defaultSearch: {
          placeholder: "搜索内容后请敲回车键...",
          key: "FCNBSearch" // 默认的搜索字段
        },
        searchItems: [
          {
            type: "Input",
            prop: "searchNumber",
            formItemAttrs: { label: "执行单号" },
            attrs: {
              clearable: true,
              style: "width:150px"
            }
          },
          {
            type: "Input",
            prop: "searchOrderName",
            formItemAttrs: { label: "执行单名称" },
            attrs: {
              clearable: true,
              style: "width:150px"
            }
          },
          {
            type: "Input",
            prop: "id",
            formItemAttrs: { label: "执行单ID" },
            attrs: {
              clearable: true,
              style: "width:150px"
            }
          },
          {
            type: "Select",
            prop: "bussinessstatus",
            default: "",
            formItemAttrs: { label: "状态", "label-width": "50px" },
            attrs: { placeholder: "选择状态", clearable: true, style: "max-width:150px" },
            data: [
              { datavalue: "", dataname: "请选择" },
              { datavalue: "4", dataname: "审核通过" },
              { datavalue: "5", dataname: "执行中" },
              { datavalue: "6", dataname: "执行完成" },
              { datavalue: "1", dataname: "修改" },
              { datavalue: "2", dataname: "待审核" }
            ]
          },
          {
            type: "Input",
            prop: "searchAdvertisername",
            formItemAttrs: { label: "直客客户" },
            attrs: {
              clearable: true,
              style: "width:150px"
            }
          },
          {
            // todo
            type: "Input",
            prop: "flightuser",
            formItemAttrs: { label: "投放人" },
            attrs: {
              clearable: true,
              style: "width:150px"
            }
          },
          {
            type: "Select",
            prop: "type",
            default: "",
            formItemAttrs: { label: "执行单类型" },
            attrs: { placeholder: "执行单类", clearable: true, style: "max-width:150px" },
            data: [
              { datavalue: "", dataname: "请选择" },
              { datavalue: "1", dataname: "硬广" },
              { datavalue: "2", dataname: "赞助" },
              { datavalue: "3", dataname: "整单video" }
            ]
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
              format: "yyyyMMdd",
              "value-format": "yyyyMMdd"
            }
          }
        ]
      }
    };
  },
  created() {
    this.fReload();
  },
  methods: {
    fReload() {
      this.$nextTick(() => {
        this.$refs.pageRef.fReload();
      });
    },
    fSearch(val) {
      this.searchObject = { ...val };
      this.fReload();
    },
    fClickRow(row) {
      this.curentSelect = row;
    },
    tableRowClassName({ row }) {
      if (row.id === this.curentSelect.id) {
        return "selected-row";
      }
      return "";
    }
  }
};
</script>
<style lang="scss">
.advproject-page {
  .selected-row {
    background: oldlace;
  }
  .bottom-info {
    margin: 10px 20px;
    font-size: 12px;
    .el-col {
      padding-bottom: 15px;
      color: #666;
      .label {
        margin-right: 20px;
      }
      .value {
        font-weight: 600;
      }
    }
  }
}
</style>
