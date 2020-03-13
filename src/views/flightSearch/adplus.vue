<template>
  <div class="page-wraper fullsize-flex adcode-wraper">
    <el-form
      label-width="120px"
      ref="formRef"
      :rules="rules"
      :inline="true"
      :model="formInline"
      class="demo-form-inline"
    >
      <el-form-item label="执行单号" prop="project_number">
        <el-input style="width: 250px;" clearable v-model="formInline.project_number" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="排期包ID" prop="bookpackage_id">
        <el-input clearable v-model="formInline.bookpackage_id" placeholder="请输入"></el-input>
      </el-form-item>
      <!-- <el-form-item label="开始/结束日期" prop="date">
        <el-date-picker
          v-model="formInline.date"
          type="daterange"
          :picker-options="pickerOptions"
          range-separator="至"
          value-format="yyyyMMdd"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane v-for="item in tabs" :label="item.label" :name="item.value" :key="item.label">
        <el-button style="margin-bottom: 10px" type="primary" @click.native="downloadExcel(item)">下载</el-button>
        <el-table
          :data="tableData"
          v-loading="bIsLoading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          border
          show-summary
          :summary-method="getSummaries"
          style="width: 100%"
        >
          <el-table-column
            align="center"
            show-overflow-tooltip
            v-for="column in filterColumns"
            v-bind="column"
            :key="column.prop"
          >
            <template slot-scope="{ row }">
              <span>{{ row | render(column) }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="ifNotBI" align="center" show-overflow-tooltip prop="event_zero" label="Os上报">
            <template slot-scope="{ row }">
              <span>{{ row.event_zero }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="ifNotBI" align="center" show-overflow-tooltip prop="event_av" label="Av上报">
            <template slot-scope="{ row }">
              <span>{{ row.event_av }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { listMixins } from "@/mixins/index";
import { PermissionMixins } from "@/mixins/index";
import store from "@/store";
import { getAdplusList } from "@/api/adplus";
import moment from "moment";
import { groupBy } from "lodash";
export default {
  mixins: [listMixins, PermissionMixins],
  data() {
    var validatePass = (rule, value, callback) => {
      let {
        formInline: { project_number, bookpackage_id }
      } = this;
      if (!project_number && !bookpackage_id) {
        return callback(new Error("执行单号和排期包ID都未填写"));
      }
      callback();
    };
    return {
      bIsLoading: false,
      formInline: {
        project_number: "",
        bookpackage_id: ""
        // date: '',
      },
      tableData: [],
      commontableData: [],
      areaTableData: [],
      bookTableData: [],
      searchObj: {},
      activeName: "click",
      rules: {
        bookpackage_id: [{ validator: validatePass, trigger: "blur" }]
        // date: [
        //   { type: 'array', required: true, message: '请选择日期' }
        // ]
      },
      pickerOptions: {
        // disabledDate(time) {
        //   return time.getTime()  < Date.now() - 86400000
        // }
      },
      tabs: [
        { label: "24H点击数据", value: "click" },
        { label: "24H曝光数据", value: "pageView" },
        { label: "地域数据", value: "area" },
        { label: "资源数据", value: "resource" }
      ],
      columns: [
        { prop: "dt", label: "投放时间", "min-width": 160 },
        { prop: "hr", label: "分时", "min-width": 120 },
        { prop: "province_name", label: "地域", "min-width": 120, filter: "areaFilter" },
        { prop: "bookpackage_id", label: "排期包ID", "min-width": 120 },
        { prop: "event_pv", label: "曝光数据" },
        { prop: "event_zero", label: "OS上报" },
        { prop: "event_av", label: "AV上报" },
        { prop: "event_click", label: "点击数据" }
      ],
      filterColumns: [],
      searchObject: {},
      filMap: {
        click: ["dt", "hr", "event_click"],
        pageView: ["dt", "hr", "event_pv"],
        area: ["province_name", "event_pv", "event_click"],
        resource: ["bookpackage_id", "event_pv", "event_click"]
      }
    };
  },
  computed: {
    ifNotBI() {
      return this.fCheckHasPermission("/monitor/realtime/adplus");
    }
  },
  watch: {
    activeName: {
      handler: function(val) {
        if (val === "area") {
          this.tableData = this.areaTableData || [];
        } else if (val === "resource") {
          this.tableData = this.bookTableData || [];
        } else {
          this.tableData = this.commontableData || [];
        }
        this.filterColumns = this.columns.filter((v) => {
          return this.filMap[val].includes(v.prop);
        });
      },
      immediate: true
    }
  },
  created() {
    console.log(this.fCheckHasPermission("/monitor/realtime/adplus"));
  },
  methods: {
    fReload() {
      this.$nextTick(() => {
        this.$refs.pageRef.fReload();
      });
    },
    downloadExcel(item) {
      console.log(item);
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          return v[j];
        })
      );
    },
    async onSubmit() {
      this.$refs["formRef"].validate(async (valid) => {
        if (valid) {
          this.bIsLoading = true;
          let { project_number, bookpackage_id } = this.formInline;
          // console.log(date);
          // let date = moment().format('YYYYMMDD')
          project_number = project_number.trim();
          bookpackage_id = bookpackage_id.trim();
          this.searchObj = Object.assign(bookpackage_id ? { bookpackage_id } : { project_number });
          let data = await getAdplusList(this.searchObj);
          // console.log(data.data);
          let { areaData, commonData, bookData } = data.data;
          this.commontableData = commonData;
          this.areaTableData = areaData;
          this.bookTableData = bookData;
          if (this.activeName === "area") {
            this.tableData = this.areaTableData;
          } else if (this.activeName === "resource") {
            this.tableData = this.bookTableData;
          } else {
            this.tableData = this.commontableData;
          }
          this.bIsLoading = false;
        } else {
          this.bIsLoading = false;
          this.$message.error("查询项有误");
          return false;
        }
      });
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总计";
          return;
        }
        if (column.label === "分时") {
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        } else {
          sums[index] = "N/A";
        }
      });
      return sums;
    }
  }
};
</script>
<style scoped lang="scss"></style>
