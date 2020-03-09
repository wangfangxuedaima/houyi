<template>
  <div class="choose-freq-wraper">
    <top-search-bar ref="searchRef" :config="searchItems" @fSearch="fSearch" @operate="fOperation"></top-search-bar>
    <pagination-pro
      class="pagination-top"
      ref="chooseFreqRef"
      method="post"
      :autoload="false"
      :page-size="10"
      :url="'/d/frequencty/list'"
      :params="searchObject"
      :loading.sync="bIsLoading"
      v-loading="bIsLoading"
    >
      <template slot-scope="{ data }">
        <el-table :data="data" class="conflict-table" @selection-change="fSelectChange" border>
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column
            align="center"
            show-overflow-tooltip
            v-for="column in columns"
            v-bind="column"
            :key="column.prop"
            v-loading="bIsLoading"
          >
            <template slot-scope="{ row }">
              <span v-if="!column.link">{{ row | render(column) }}</span>
              <router-link v-else :to="{ path: column.link + '/' + row.id }" class="link">
                {{ row | render(column) }}
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </pagination-pro>
  </div>
</template>
<script>
import { fSaveFreq } from "@/api/flight/adgroup";
import TopSearchBar from "@/components/TopSearchBar";
import { listMixins } from "@/mixins/index";
export default {
  mixins: [listMixins],
  components: { TopSearchBar },
  data() {
    return {
      columns: [
        { prop: "id", label: "ID", "min-width": 60 },
        { prop: "name", label: "名称", "min-width": 120 },
        {
          prop: "type",
          label: "类型",
          "min-width": 80,
          formatter: (rowObject) => {
            let map = { 0: "自定义", 1: "全周期", 2: "天", 3: "分钟", 4: "月", 5: "季度" };
            return map[rowObject.type] || "未知";
          }
        },
        { prop: "duration", label: "周期", "min-width": 60 },
        { prop: "number", label: "控频次数", "min-width": 60 },
        {
          prop: "addFrequencyNum",
          label: "追投",
          "min-width": 100,
          formatter: (rowObject) => {
            let isAdd = rowObject.isAddFrequency;
            if (isAdd == null || isAdd != 1) {
              return "不追投";
            } else {
              return rowObject.addFrequencyNum;
            }
          }
        },
        {
          prop: "pageType",
          label: "页面类型",
          "min-width": 100,
          formatter: (rowObject) => {
            let map = { 1: "播放器", 2: "页面" };
            return map[rowObject.pageType] || "未知";
          }
        },
        { prop: "platName", label: "平台", "min-width": 60 },
        {
          prop: "projectNumber",
          label: "执行单",
          "min-width": 120,
          formatter: (rowObject) => {
            let pnumber = rowObject.projectNumber;
            if (pnumber != null && pnumber == this.projectNumber) {
              return "本单";
            } else {
              return pnumber;
            }
          }
        }
      ],
      bIsLoading: false,
      searchObject: {},
      addList: []
    };
  },
  props: {
    adgroups: {
      type: Array,
      default: () => {
        return [];
      }
    },
    type: {
      type: Number,
      default: 1 //1 组频次 2 物料频次 3 推送频次
    },
    // 执行单号
    projectNumber: {
      type: String,
      default: ""
    }
  },
  computed: {
    searchItems() {
      let adgroup = (this.adgroups && this.adgroups[0]) || {};
      let pagetype = adgroup.bartemplet && adgroup.bartemplet.pagetype;
      return {
        labelWidth: "60px",
        searchItems: [
          {
            type: "Input",
            prop: "id",
            formItemAttrs: { label: "频次ID", "label-width": "50px" },
            attrs: { clearable: true, style: "width:140px" }
          },
          {
            type: "Input",
            prop: "name",
            formItemAttrs: { label: "频次名称" },
            attrs: { clearable: true, style: "width:140px" }
          },
          {
            type: "Select",
            prop: "type",
            default: "",
            formItemAttrs: { label: "频次类型" },
            attrs: { placeholder: "频次类型", clearable: true, style: "max-width:120px" },
            data: [
              { datavalue: "", dataname: "全部" },
              { datavalue: "1", dataname: "全周期" },
              { datavalue: "2", dataname: "天" },
              { datavalue: "3", dataname: "分钟" },
              { datavalue: "4", dataname: "月" },
              { datavalue: "5", dataname: "季度" }
            ]
          },
          {
            type: "Input",
            prop: "duration",
            formItemAttrs: { label: "频控周期" },
            attrs: { clearable: true, style: "width:80px" }
          },
          {
            type: "Input",
            prop: "number",
            formItemAttrs: { label: "控频次数" },
            attrs: { clearable: true, style: "width:80px" }
          },
          {
            type: "Select",
            prop: "isAddFrequency",
            default: "",
            formItemAttrs: { label: "追投", "label-width": "50px" },
            attrs: { placeholder: "", clearable: true, style: "max-width:120px" },
            data: [
              { datavalue: "", dataname: "全部" },
              { datavalue: "1", dataname: "追投" },
              { datavalue: "0", dataname: "不追投" }
            ]
          },
          {
            type: "Input",
            prop: "addFrequencyNum",
            formItemAttrs: { label: "追投次数" },
            attrs: { clearable: true, style: "width:80px" },
            ifRender: (data) => {
              return data.isAddFrequency == 1;
            }
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
          },
          {
            type: "Select",
            prop: "pageType",
            formItemAttrs: { label: "页面类型" },
            attrs: { placeholder: "", clearable: true, style: "max-width:120px" },
            data: [
              { datavalue: "", dataname: "全部", disabled: pagetype ? true : false },
              { datavalue: "1", dataname: "播放器", disabled: pagetype === "2" },
              { datavalue: "2", dataname: "页面", disabled: pagetype === "1" }
            ]
          },
          {
            type: "Select",
            prop: "plat",
            total: true,
            formItemAttrs: { label: "平台", "label-width": "50px" },
            attrs: { placeholder: "请选择", clearable: true, style: "max-width:140px" },
            listGetter: {
              url: "/system/basedata/list",
              params: { searchDatatype: "plat" },
              keyMap: { list: "rows" },
              data: [],
              optionValue: "datavalue",
              optionName: "dataname"
            }
          },
          {
            type: "Input",
            prop: "projectNumber",
            formItemAttrs: { label: "执行单号" },
            attrs: { placeholder: "默认为本执行单", clearable: true, style: "width:140px" }
          }
        ],
        searchButtons: [
          { name: "查询" },
          { name: "重置" },
          { name: "添加", attrs: { disabled: this.addList.length === 0 } }
        ]
      };
    }
  },
  mounted() {
    setTimeout(() => {
      let adgroup = (this.adgroups && this.adgroups[0]) || {};
      let obj = {
        plat: adgroup.plat.toString(),
        pageType: adgroup.bartemplet && adgroup.bartemplet.pagetype
      };
      this.$refs.searchRef.fSetSearchVal(obj);
      this.fSearch(obj);
    }, 2000);
  },
  methods: {
    fReload() {
      this.$nextTick(() => {
        this.$refs.chooseFreqRef.fReload();
      });
    },
    fSearch(val = {}) {
      this.searchObject = {
        ...val,
        ftype: this.type == 3 ? 2 : 1,
        projectNumber: this.projectNumber
      };
      this.fReload();
    },
    fSelectChange(arr) {
      this.addList = arr;
    },
    fOperation(btn) {
      if (btn.name === "添加") {
        let adgroupIds = this.adgroups.map((item) => {
          return item.id;
        });
        let freqIds = this.addList.map((item) => {
          return item.id;
        });
        fSaveFreq(adgroupIds, freqIds).then((res) => {
          if (res.status === 0) {
            this.$message({
              message: res.message,
              type: "success"
            });
            this.$emit("reload");
          }
        });
      }
    }
  }
};
</script>
