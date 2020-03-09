<template>
  <el-dialog title="复制广告组" :visible.sync="bIsVisible" width="1000px" class="copy-outer-dia">
    <top-search-bar
      ref="searchRef"
      :config="searchItems"
      @fSearch="fSearchProject"
      @operate="fOperate"
    ></top-search-bar>
    <pagination-pro
      class="mg-t-10 grow-1"
      ref="pageCopyRef"
      method="post"
      :loading.sync="bIsLoading"
      :autoload="false"
      :fullsize="true"
      :page-size="15"
      :url="'/d/bookpkg/listCopyBps'"
      :params="searchObject"
    >
      <template slot-scope="{ data }">
        <el-table v-loading="bIsLoading" :data="data" height="360px" @selection-change="fSelectChange" border>
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column
            align="center"
            show-overflow-tooltip
            v-for="column in columns"
            v-bind="column"
            :key="column.prop"
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
  </el-dialog>
</template>
<script>
import * as constantData from "@/utils/constant";
import * as formatterUtil from "@/utils/formatter";

import TopSearchBar from "@/components/TopSearchBar";
import { listMixins } from "@/mixins/index";
import { omit } from "lodash";
import { fCoppyOutter } from "@/api/flight/adgroup";

export default {
  mixins: [listMixins],
  components: { TopSearchBar },
  inject: ["routerRefresh"], //在子组件中注入在父组件中创建的属性
  data() {
    return {
      searchItems: {
        labelWidth: "75px",
        searchItems: [
          {
            type: "Input",
            prop: "projectNumber",
            formItemAttrs: {
              label: "执行单号",
              rules: [{ required: true, message: "请填写执行单号！", trigger: "blur" }]
            },
            attrs: {
              clearable: true,
              style: "width:180px"
            }
          },
          {
            type: "Input",
            prop: "bpid",
            formItemAttrs: { label: "主包ID", "label-width": "50px" },
            attrs: {
              clearable: true,
              style: "width:150px"
            }
          },
          {
            type: "Input",
            prop: "groupSuffix",
            formItemAttrs: { label: "广告组后缀" },
            attrs: {
              clearable: true,
              style: "width:150px"
            }
          }
        ],
        searchButtons: [{ name: "搜索" }, { name: "确认", valid: true }, { name: "取消", type: "info" }]
      },
      columns: [
        { prop: "id", label: "ID", "min-width": 90 },
        { prop: "bpid", label: "排期包ID", "min-width": 90 },
        { prop: "pkgname", label: "排期包名称", "min-width": 260 },
        { prop: "cpmResourceName", label: "内容定向", "min-width": 200 },
        { prop: "hdName", label: "小时/分钟定向", "min-width": 120, formatter: formatterUtil.hdNameFormatter },
        { prop: "areaName", label: "地域定向", "min-width": 120 },
        { prop: "duration", label: "广告时长", "min-width": 90, filter: "secondFilter" },
        { prop: "adStyleName", label: "广告形式", "min-width": 120 },
        { prop: "saletypeName", label: "售卖方式", "min-width": 120 },
        { prop: "note", label: "备注", "min-width": 120 },
        { prop: "timearea", label: "投放时间", "min-width": 200, formatter: formatterUtil.flightDateFormatter },
        { prop: "allcount", label: "预定量", "min-width": 90, formatter: formatterUtil.allcountFomatter },
        {
          prop: "usetypeName",
          label: "使用属性",
          "min-width": 80,
          formatter(rowObject) {
            return constantData.SaleTypeMap[rowObject.usetype] || "未知";
          }
        }
      ],
      bIsLoading: false,
      searchObject: { projectNumber: "", groupSuffix: "" },
      selectRows: []
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    adgroups: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  computed: {
    bIsVisible: {
      get: function() {
        return this.value;
      },
      set: function(val) {
        this.$emit("input", val);
      }
    }
  },
  methods: {
    fReload() {
      this.$nextTick(() => {
        this.$refs.pageCopyRef.fReload();
      });
    },
    fOperate(btn) {
      switch (btn.name) {
        case "确认":
          this.fCoppyOutter();
          break;
        case "取消":
          this.bIsVisible = false;
          break;
      }
    },
    fSearchProject(val) {
      this.searchObject = { ...omit(val, "groupSuffix") };
      if (this.searchObject.projectNumber || this.searchObject.bpid) {
        this.fReload();
      }
    },
    fSelectChange(rows) {
      this.selectRows = rows;
    },
    fCoppyOutter() {
      if (this.selectRows.length < 1) {
        this.$message({
          message: "跨单复制至少需要选择一个排期包进行复制广告组关联!",
          type: "warning"
        });
        return;
      }
      if (this.fCheckAdstyleAndPlat()) {
        this.$message({
          message: "跨单复制需要选择相同的平台和广告形式!",
          type: "warning"
        });
        return;
      }

      let bpids = this.selectRows.map((item) => {
        return item.id;
      });
      fCoppyOutter({
        bpids: bpids.join(","),
        projectNumber: this.searchObject.projectNumber,
        groupId: this.adgroups[0] && this.adgroups[0].id,
        groupSuffix: this.searchObject.groupSuffix
      }).then((res) => {
        this.bIsVisible = false;
        if (res.status !== 0) {
          this.$message({
            message: res.message || "新建失败",
            type: "error"
          });
          return;
        }
        this.$message({
          message: "复制成功",
          type: "success"
        });
      });
    },
    fCheckAdstyleAndPlat() {
      let plats = new Set();
      let adstyles = new Set();
      this.selectRows.forEach((row) => {
        plats.add(row.plat);
        adstyles.add(row.adStyle);
      });
      if (plats.size > 1 || adstyles.size > 1) {
        return true;
      }
      return false;
    }
  }
};
</script>
<style scoped lang="scss"></style>
