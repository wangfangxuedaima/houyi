<template>
  <div class="page-wraper fullsize fullsize-flex viewflight-wraper">
    <top-search-bar ref="searchRef" :config="searchItems" @operate="fOperate" @fSearch="fSearch"></top-search-bar>
    <pagination-pro
      class="mg-t-10 grow-1"
      ref="pageRef"
      :loading.sync="bIsLoading"
      :autoload="false"
      :fullsize="true"
      :page-size="20"
      :page-sizes="[20, 50, 100, 200]"
      layout="sizes, prev, pager, next, ->, total"
      :url="'/d/viewflight/listBooks'"
      :params="searchObject"
      :onResponse="fOnResponse"
      method="post"
    >
      <template v-slot="{ data, height }">
        <el-table
          v-loading="bIsLoading"
          :data="data"
          :max-height="height"
          @selection-change="handleSelectionChange"
          border
        >
          <el-table-column align="center" type="selection" width="40"></el-table-column>
          <template v-for="v in columns">
            <el-table-column show-overflow-tooltip align="center" v-bind="v" :key="v.prop">
              <template v-slot="{ row }">{{ row | render(v) }}</template>
            </el-table-column>
          </template>
        </el-table>
      </template>
    </pagination-pro>
  </div>
</template>

<script>
import { getCityData } from "@/api/flight/viewflight";
import TopSearchBar from "@/components/TopSearchBar";
import { listMixins } from "@/mixins";
export default {
  name: "viewFlight",
  components: { TopSearchBar },
  mixins: [listMixins],
  data() {
    return {
      gridData: [],
      showList: [],
      columns: [
        { prop: "bookDate", label: "日期", filter: "date" },
        {
          prop: "cpmcount",
          label: "预定量",
          filter: "cpmFun"
        },
        {
          prop: "flightcpm",
          label: "实际投放量",
          filter: "cpmFun"
        },
        {
          prop: "finishedcpm",
          label: "完成量",
          filter: "cpmFun"
        }
      ],
      bIsLoading: false,
      dialogTableVisible: false,
      searchObject: {
        bookPackageId: this.$route.params.id
      },
      canOperate: true,
      searchItems: {
        labelWidth: "75px",
        hideenSearchBtn: true,
        searchButtons: [],
        searchItems: [
          {
            type: "Input",
            prop: "projectNumber",
            formItemAttrs: { label: "执行单号" },
            attrs: {
              clearable: true,
              disabled: true,
              style: "width:150px"
            }
          },
          {
            type: "Input",
            prop: "bpId",
            disabled: true,
            formItemAttrs: { label: "排期包ID" },
            attrs: { clearable: true, style: "width:150px", disabled: true }
          },
          {
            type: "Input",
            prop: "pkgname",
            disabled: true,
            formItemAttrs: { label: "排期包名" },
            attrs: { clearable: true, style: "width:150px", disabled: true }
          },
          {
            type: "Input",
            disabled: true,
            prop: "advertisername",
            default: "",
            formItemAttrs: { label: "广告主" },
            attrs: { style: "width:150px", clearable: true, disabled: true }
          },
          {
            type: "Input",
            disable: true,
            prop: "startTime",
            default: "",
            formItemAttrs: { label: "开始日期" },
            attrs: { style: "width:150px", clearable: true, disabled: true }
          },
          {
            type: "Input",
            disabled: true,
            prop: "endTime",
            default: "",
            formItemAttrs: { label: "结束日期" },
            attrs: { style: "width:150px", clearable: true, disabled: true }
          },
          {
            type: "DataPicker",
            prop: "submitTime",
            startTimeKey: "starttime",
            endTimeKey: "endtime",
            formItemAttrs: { label: "起止日期", "label-width": "75px" },
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
      this.searchObject = { ...val };
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
