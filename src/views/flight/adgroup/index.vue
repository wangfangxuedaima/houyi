<template>
  <div class="page-wraper fullsize fullsize-flex adgroup-page">
    <top-search-bar ref="searchRef" :config="searchItems" @fSearch="fSearch" @operate="fOperation">
      <!-- 复制广告组 -->
      <template slot="copy-adgroup-solt">
        <div class="solt-item" v-for="(item, index) in copyActionList" :key="index" @click="fTopOperationClick(item)">
          {{ item }}
        </div>
      </template>
      <!-- 更多 -->
      <template slot="more-adgroup-solt">
        <div class="solt-item" v-for="(item, index) in moreActionList" :key="index" @click="fTopOperationClick(item)">
          {{ item }}
        </div>
      </template>
      <!-- 导入导出监测 -->
      <template slot="import-adgroup-solt">
        <div class="solt-item" v-for="(item, index) in importActionList" :key="index" @click="fTopOperationClick(item)">
          {{ item }}
        </div>
      </template>
      <div slot="search-right">
        <el-input v-model="maIds" size="small" placeholder="按物料ID展示广告,逗号分割"></el-input>
      </div>
    </top-search-bar>
    <pagination-pro
      class="mg-t-10 grow-1"
      ref="pageRef"
      method="post"
      :loading.sync="bIsLoading"
      :autoload="false"
      :fullsize="true"
      :page-size="15"
      :url="'/d/adgroup/list'"
      :params="searchObject"
      :onResponse="fOnResponse"
    >
      <template slot-scope="{ data, height }">
        <el-table
          ref="tableRef"
          v-loading="bIsLoading"
          :data="data"
          :height="height"
          :row-class-name="tableRowClassName"
          @row-click="fChangeClickRow"
          @select="fSelectionChange"
          @select-all="fSelectionChange"
          border
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column
            align="center"
            show-overflow-tooltip
            v-for="column in columns"
            v-bind="column"
            :key="column.prop"
          >
            <template slot-scope="{ row }">
              <span
                v-if="column.prop === 'name'"
                v-html="$options.filters.render(row, column)"
                @click="fShowModifyRelated(row)"
              ></span>
              <span v-else-if="!column.link" v-html="$options.filters.render(row, column)"></span>
              <router-link v-else :to="{ path: column.link + '/' + row.id }" class="link">
                {{ row | render(column) }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column align="center" width="200px" label="组频次" class-name="freq-column">
            <template slot-scope="{ row }">
              <el-tag
                v-for="item in row.frequencies"
                :key="item.id"
                @close="fDeleteFreq(row.id, item.id)"
                closable
                type="info"
              >
                {{ item.id + "-" + item.name }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </pagination-pro>
    <!-- 广告信息组件 -->
    <AdvInfo ref="advInfoRef"></AdvInfo>
    <!-- 新建广告 -->
    <AdvAdd v-model="bIsAddAdvVisible" :adgroups="selectedRows" @addAdvSuccess="fReloadAdvInfo"></AdvAdd>
    <!-- 本单复制 -->
    <CopyInner v-model="bIsCopyInnerVisible" :adgroups="selectedRows" :projectNumber="projectInfo.number"></CopyInner>
    <!-- 跨单复制 -->
    <CopyOuter v-model="bIsCopyOuterVisible" :adgroups="selectedRows"></CopyOuter>
    <!-- 设置广告备注 -->
    <AdnoteSet v-model="bIsSetAdNoteVisible" :adgroups="selectedRows" @reload="fReload"></AdnoteSet>
    <!-- 导入监测地址 -->
    <ImportMonitor v-model="bISImportMonitorVisible"></ImportMonitor>
    <!-- 更新投放 -->
    <FlightConfirm ref="flightConfirmRef" :adgroups="selectedRows"></FlightConfirm>
    <!-- 冲突广告组 -->
    <ConflictView v-model="bISSetConfilctVisible" ref="conflictViewRef"></ConflictView>
    <!-- 修改关联 -->
    <RelatedBplist v-model="bISModifyRelatedVisible" ref="RelatedBpRef"></RelatedBplist>
    <!-- 组频次 -->
    <RelatedFreq
      v-model="bISRelatedFreqVisible"
      :adgroups="selectedRows"
      :projectNumber="projectInfo.number"
      :type="1"
      @reload="fReload"
    ></RelatedFreq>
  </div>
</template>
<script>
import { listMixins } from "@/mixins/index";
import { parseTime } from "@/utils/index";
import { fDealSearchAreas } from "@/utils/formatter";

import {
  fGetProjectInfo,
  fCheckAdGroupStatus,
  fOperateAdgroup,
  fDeleteAdgroup,
  fCancelAdgroupConflict,
  fDownExportTemplate,
  fDownDetectionTemplate,
  fCheckFlightStatus,
  fDelFreq
} from "@/api/flight/adgroup";

import TopSearchBar from "@/components/TopSearchBar";
import AdvInfo from "./components/AdvInfo";
import AdvAdd from "./components/AdvAdd";
import CopyInner from "./components/CopyInner";
import CopyOuter from "./components/CopyOuter";
import AdnoteSet from "./components/AdnoteSet";
import ImportMonitor from "./components/ImportMonitor";
import FlightConfirm from "./components/FlightConfirm";
import ConflictView from "./components/ConflictView";
import RelatedBplist from "./components/RelatedBplist";
import RelatedFreq from "./components/RelatedFreq/index";

import * as constantData from "@/utils/constant";
export default {
  mixins: [listMixins],
  components: {
    TopSearchBar,
    AdvInfo,
    AdvAdd,
    CopyInner,
    CopyOuter,
    AdnoteSet,
    ImportMonitor,
    FlightConfirm,
    ConflictView,
    RelatedBplist,
    RelatedFreq
  },
  data() {
    let popoverConfig = {
      slotName: "",
      isVisible: false,
      attrs: {
        width: "100px",
        placement: "bottom",
        trigger: "hover",
        "popper-class": "adgroup-popover"
      }
    };
    let projectId = this.$route.query.projectid;
    return {
      columns: [
        { prop: "id", label: "广告组ID", "min-width": 80 },
        { prop: "flightstatus", label: "状态", "min-width": 80, filter: "flightstatusFilter" },
        { prop: "name", label: "广告组名称", "min-width": 200, formatter: this.fFormatName },
        { prop: "platsname", label: "平台", "min-width": 90, formatter: this.fFormatPlat },
        {
          prop: "starttime",
          label: "地域",
          "min-width": 120,
          formatter(rowObject) {
            return rowObject.area || "全球";
          }
        },
        { prop: "resource", label: "内容", "min-width": 220 },
        { prop: "adstyleName", label: "广告形式", "min-width": 120 },
        { prop: "duration", label: "时长", "min-width": 60 },
        {
          prop: "flightDurationStart",
          label: "投放时间",
          "min-width": 280,
          formatter(rowObject) {
            if (rowObject.starttime && rowObject.endtime) {
              return `${parseTime(rowObject.starttime)}
               ~ ${parseTime(rowObject.endtime)}`;
            }
            return "";
          }
        },
        { prop: "modifytime", label: "最后更新时间", "min-width": 160, filter: "time" },
        { prop: "note", label: "排期包备注", "min-width": 90 },
        {
          prop: "usetypes",
          label: "使用属性",
          "min-width": 80,
          formatter(rowObject) {
            let arr = rowObject.usetypes
              .map((type) => {
                return constantData.SaleTypeMap[type] || "";
              })
              .filter((item) => {
                return !!item;
              });
            return arr.join(",");
          }
        },
        { prop: "adNote", label: "广告备注", "min-width": 80 },
        {
          prop: "type",
          label: "广告类型",
          "min-width": 100,
          formatter(rowObject) {
            let map = { 0: "普通线", 1: "事故线" };
            return map[rowObject.type] || "未知";
          }
        },
        { prop: "templateName", label: "模板类型", "min-width": 160 },
        { prop: "activeAdType", label: "广告类型字段", "min-width": 100 }
      ],
      searchItems: {
        labelWidth: "75px",
        topButtons: [
          { name: "新建广告" },
          { name: "新建广告组", routerLink: `/flight/advproject/adgroup/bplist?projectid=${projectId}` },
          {
            name: "复制广告组",
            rightIcon: "el-icon-caret-bottom",
            popover: { ...popoverConfig, slotName: "copy-adgroup-solt" }
          },
          { name: "编辑广告", pemissionUrl: "/p/ad/edit" },
          { name: "更新投放", pemissionUrl: "/d/advflight/flight" },
          {
            name: "更多",
            rightIcon: "el-icon-caret-bottom",
            popover: { ...popoverConfig, slotName: "more-adgroup-solt" }
          },
          {
            name: "导入/导出监测",
            rightIcon: "el-icon-caret-bottom",
            popover: { ...popoverConfig, slotName: "import-adgroup-solt" }
          },
          { name: "组频次" }
        ],
        defaultSearch: {
          placeholder: "搜索内容后请敲回车键...",
          key: "FCNBSearch" // 默认的搜索字段
        },
        searchItems: [
          {
            type: "Input",
            prop: "name",
            formItemAttrs: { label: "广告组名称" },
            attrs: {
              clearable: true,
              style: "width:120px"
            }
          },
          {
            type: "Select",
            prop: "adstyle",
            default: "",
            formItemAttrs: { label: "广告形式" },
            attrs: { placeholder: "请选择", clearable: true, style: "max-width:150px" },
            listGetter: {
              url: "",
              params: { datatype: "plat" },
              keyMap: { list: "data" },
              data: [],
              optionValue: "map_value",
              optionName: "map_name"
            }
          },
          {
            type: "Select",
            prop: "duration",
            default: "",
            formItemAttrs: { label: "广告时长", "label-width": "75px" },
            attrs: { placeholder: "请选择", clearable: true, style: "max-width:100px" },
            data: constantData.durations
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
            type: "Select",
            prop: "usetype",
            formItemAttrs: { label: "使用属性" },
            attrs: { placeholder: "请选择", clearable: true, style: "max-width:150px" },
            listGetter: {
              url: "/system/basedata/list",
              params: { searchDatatype: "usetype" },
              keyMap: { list: "rows" },
              data: [],
              optionValue: "datavalue",
              optionName: "dataname",
              filter: (arr) => {
                return arr.filter((item) => {
                  return item.status != 2;
                });
              }
            }
          },
          {
            type: "Select",
            prop: "areaCodes",
            default: [],
            formItemAttrs: { label: "地域定向" },
            attrs: {
              placeholder: "请选择",
              multiple: true,
              filterable: true,
              "collapse-tags": true,
              clearable: true,
              style: "max-width:150px"
            },
            listGetter: {
              url: "/d/area/searchArealist",
              params: {},
              keyMap: { list: "rows" },
              data: [],
              optionValue: "value",
              optionName: "data",
              filter: fDealSearchAreas
            }
          },
          {
            type: "Select",
            prop: "flightstatus",
            default: "",
            formItemAttrs: { label: "状态", "label-width": "50px" },
            attrs: { placeholder: "选择状态", clearable: true, style: "max-width:150px" },
            data: [
              { datavalue: "", dataname: "请选择" },
              { datavalue: "0", dataname: "未投放" },
              { datavalue: "2", dataname: "预投放" },
              { datavalue: "3", dataname: "投放暂停" },
              { datavalue: "4", dataname: "投放终止" },
              { datavalue: "5", dataname: "投放成功" },
              { datavalue: "6", dataname: "投放正在进行" },
              { datavalue: "7", dataname: "投放未成功" },
              { datavalue: "8", dataname: "投放物料审核不通过" },
              { datavalue: "9", dataname: "已提交" },
              { datavalue: "10", dataname: "投放完成" }
            ]
          },
          {
            type: "Select",
            prop: "type",
            default: "",
            formItemAttrs: { label: "广告类型" },
            attrs: { placeholder: "选择状态", clearable: true, style: "max-width:150px" },
            data: [
              { datavalue: "", dataname: "请选择" },
              { datavalue: "0", dataname: "普通线" },
              { datavalue: "1", dataname: "故事线" }
            ]
          },
          {
            type: "Input",
            prop: "materialid",
            formItemAttrs: { label: "物料ID", "label-width": "50px" },
            attrs: {
              clearable: true,
              style: "width:150px"
            }
          },
          {
            type: "Input",
            prop: "note",
            formItemAttrs: { label: "排期包备注" },
            attrs: {
              clearable: true,
              style: "width:150px"
            }
          },
          {
            type: "DataPicker",
            prop: "submitTime",
            startTimeKey: "starttime",
            endTimeKey: "endtime",
            formItemAttrs: { label: "投放日期", "label-width": "80px" },
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
            type: "Input",
            prop: "mainBgIdStr",
            formItemAttrs: { label: "主包ID", "label-width": "50px" },
            attrs: {
              clearable: true,
              style: "width:150px"
            }
          },
          // 无效广告组 check
          {
            type: "CheckBox",
            prop: "delbpstatus",
            default: 0,
            formItemAttrs: { label: "无效广告组" },
            attrs: {
              "true-label": 1,
              "false-label": 0
            }
          },
          {
            type: "Input",
            prop: "adNote",
            formItemAttrs: { label: "广告备注" },
            attrs: {
              clearable: true,
              style: "width:150px"
            }
          },
          {
            // 20200303 新增
            type: "Input",
            prop: "materialIdListStr",
            formItemAttrs: { label: "频次ID", "label-width": "50px" },
            attrs: {
              clearable: true,
              style: "width:120px"
            }
          }
        ]
      },
      copyActionList: ["本单复制", "跨单复制"],
      moreActionList: ["终止", "暂停", "删除", "导出执行信", "冲突广告组", "取消互斥", "设置广告备注"],
      importActionList: ["下载导入模版", "导入监测地址", "批量导出监测"],
      searchObject: { projectid: projectId, bussinessstatus: -1 },
      bIsLoading: false,
      selectedRows: [], // 选中的广告组
      currentSelectdRow: null, // 当前选中的行
      projectId: projectId, // 执行单id
      projectInfo: {},
      maIds: "",
      bIsAddAdvVisible: false,
      bIsCopyInnerVisible: false,
      bIsCopyOuterVisible: false,
      bIsSetAdNoteVisible: false,
      bISImportMonitorVisible: false,
      bISSetConfilctVisible: false,
      bISModifyRelatedVisible: false,
      bISRelatedFreqVisible: false
    };
  },
  async created() {
    // 获取执行单信息
    await this.fGetProjectInfo();
    await this.fReload();
  },
  methods: {
    fReload() {
      this.selectedRows = [];
      this.$nextTick(() => {
        this.$refs.pageRef.fReload();
      });
    },
    fGetProjectInfo() {
      fGetProjectInfo(this.projectId).then((res) => {
        let projects = res.rows || [];
        projects.forEach((item) => {
          if (item.id == this.projectId) {
            this.projectInfo = item;
          }
        });
      });
    },
    fOnResponse(data) {
      let adGroups = data.rows;
      process.nextTick(() => {
        let pathIds = this.$route.query.ids && this.$route.query.ids.split(",");
        if (pathIds) {
          adGroups.forEach((row) => {
            if (pathIds.includes(row.id.toString())) {
              this.$refs.tableRef.toggleRowSelection(row, true);
              this.selectedRows.push(row);
            }
          });
        }
      });
    },
    // emit
    fSearch(val) {
      this.searchObject = {
        ...val,
        projectid: this.projectId,
        areaCodes: val.areaCodes.join(","),
        platCodes: val.platCodes.join(","),
        delbpstatus: val.delbpstatus == 1 ? 1 : ""
      };
      this.fReload();
    },
    fReloadAdvInfo() {
      // 设置当前展示广告信息的广告组
      this.$refs.advInfoRef.fSelectRow(this.currentSelectdRow, true);
    },
    fSelectionChange(selectRows, row = "") {
      this.selectedRows = selectRows;
      this.currentSelectdRow = row;
      this.$refs.advInfoRef.fSelectRow(row);
    },
    tableRowClassName({ row }) {
      // 选中行展示
      let selectedRowIds = this.selectedRows.map((item) => {
        return item.id;
      });
      if (selectedRowIds.includes(row.id)) {
        return "selected-row";
      }
      return "";
    },
    // click
    fChangeClickRow(row) {
      if (this.selectedRows.includes(row)) {
        let index = -1;
        this.selectedRows.forEach((item, v) => {
          if (row.id === item.id) {
            index = v;
          }
        });
        this.$refs.tableRef.toggleRowSelection(row, false);
        this.selectedRows.splice(index, 1);
      } else {
        this.$refs.tableRef.toggleRowSelection(row, true);
        this.selectedRows.push(row);
      }
      this.currentSelectdRow = row;
      // 设置当前展示广告信息的广告组
      this.$refs.advInfoRef.fSelectRow(row);
    },
    fOperation(btn) {
      this.fTopOperationClick(btn.name);
    },
    fTopOperationClick(btnName) {
      let noSeletTipMap = {
        新建广告: "请选择广告组后再批量创建广告!",
        编辑广告: "请选择要编辑的广告",
        本单复制: "请选择要复制的广告组!",
        跨单复制: "请选择要复制的广告组!",
        更新投放: "请选择需要更新投放的广告组！",
        终止: "请选择需要终止投放的广告组!",
        暂停: "请选择需要暂停投放的广告组！",
        删除: "请选择要删除的广告组!",
        导出执行信: "请先选择广告组!",
        冲突广告组: "请选择记录进行操作！",
        下载导入模版: "请先选择广告组",
        批量导出监测: "请先选择广告组",
        组频次: "请先选择广告组！"
      };
      if (this.selectedRows.length === 0 && noSeletTipMap[btnName]) {
        this.$message({
          message: noSeletTipMap[btnName],
          type: "warning"
        });
        return;
      }
      switch (btnName) {
        case "新建广告":
          this.bIsAddAdvVisible = true;
          break;
        case "编辑广告":
          this.fEditAd();
          break;
        case "本单复制":
          this.bIsCopyInnerVisible = true;
          break;
        case "跨单复制":
          if (this.selectedRows.length > 1) {
            this.$message({
              message: "跨单复制只能选择一个广告组进行复制!",
              type: "warning"
            });
            return;
          }
          this.bIsCopyOuterVisible = true;
          break;
        case "更新投放":
          this.fReFlight();
          break;
        case "终止":
          this.fOperateAdgroups("stop");
          break;
        case "暂停":
          this.fOperateAdgroups("suspend");
          break;
        case "删除":
          this.fDeleteAdgroups();
          break;
        case "导出执行信":
          this.fDownLetter();
          break;
        case "冲突广告组":
          this.fSetConflict();
          break;
        case "取消互斥":
          this.fCancelConflict();
          break;
        case "设置广告备注":
          this.bIsSetAdNoteVisible = true;
          break;
        case "下载导入模版":
          this.fDownExportTemplate();
          break;
        case "导入监测地址":
          this.bISImportMonitorVisible = true;
          break;
        case "批量导出监测":
          this.fDownDetectionTemplate();
          break;
        case "组频次":
          this.fRelatedFreq();
          break;
      }
    },
    // 编辑广告
    async fEditAd() {
      let ids = this.fGetSeletedAdgroupIds();
      let hasError = await this.fCheckAdGroupStatus(ids);
      if (hasError) {
        return;
      }
      let pattern = /^(\d+,)*(\d+|(,)*)$/;
      if (this.maIds.length > 0 && !pattern.test(this.maIds)) {
        this.$message({
          message: "物料ID格式填写错误！请检查",
          type: "warning"
        });
        return;
      }
      this.$router.push({
        path: `/flight/advproject/adgroup/adedit`,
        query: { projectid: this.projectId, agids: ids, maIds: this.maIds }
      });
    },
    // 更新投放
    fReFlight() {
      let conflictResult = false;
      let canFlight = true;
      this.selectedRows.forEach((item) => {
        //状态为"审核拒绝"的广告组不允许更新投放！
        if (canFlight && item.flightstatus === 8) {
          canFlight = false;
        }
        //可跳过前贴片的广告必须设置冲突所有，不能更新投放！
        let isConflict = item.adstyleName === "前贴片" && item.activeAdType === "可跳过" && item.conflictgroup !== "*";
        if (!conflictResult && isConflict) {
          conflictResult = false;
        }
      });
      if (conflictResult) {
        this.$message.warning("联动广告可跳过前贴片的广告必须设置冲突所有，不能更新投放！");
        return;
      }
      if (!canFlight) {
        this.$message.warning("状态为'审核拒绝'的广告组不允许更新投放");
        return;
      }
      let ids = this.fGetSeletedAdgroupIds();
      fCheckFlightStatus(ids)
        .then((res) => {
          if ([0, 702].includes(res.status)) {
            this.$refs.flightConfirmRef.setData(res);
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(() => {
          this.$message.error("读取发生异常！");
        });
    },
    //冲突广告组
    fSetConflict() {
      //只有前贴片和中插片可以设置冲突广告组
      let notAllow = this.selectedRows.filter((item) => {
        return !["前贴", "中插", "前贴片", "中插片"].includes(item.adstyleName);
      });
      if (notAllow.length > 0) {
        this.$message({
          message: "只有前贴片和中插片可以设置冲突广告组",
          type: "warning"
        });
        return;
      }
      // 	联动广告倒一帖不支持设置冲突广告组 20200302新增
      let linkNotAllow = this.selectedRows.filter((item) => {
        return item.activeAdType === "联动广告" && [("oad-1", "mad-1")].includes(item.positionDirect);
      });
      if (linkNotAllow.length > 0) {
        this.$message({
          message: "联动广告倒一帖不支持设置冲突广告组",
          type: "warning"
        });
        return;
      }
      let ids = this.fGetSeletedAdgroupIds().split(",");
      this.$refs.conflictViewRef.setConflictData(this.projectInfo.number, ids);
      this.bISSetConfilctVisible = true;
    },
    //组频次
    fRelatedFreq() {
      //不为故事线无法设置组频次
      let notAllows = [];
      this.selectedRows.forEach((item) => {
        if (item.type != 1) {
          notAllows.push(item.id);
        }
      });
      if (notAllows.length > 0) {
        this.$message({
          message: `id为${notAllows.join(",")} 的广告组广告类型不为故事线，无法设置组频次！`,
          type: "warning"
        });
        return;
      }
      this.bISRelatedFreqVisible = true;
    },
    // 终止暂停投放
    async fOperateAdgroups(type) {
      let ids = this.fGetSeletedAdgroupIds();
      let hasError = await this.fCheckAdGroupStatus(ids);
      if (hasError) {
        return;
      }
      fOperateAdgroup(type, ids)
        .then((data) => {
          data = data || {};
          let mesage = Object.keys(data)
            .map((id) => {
              return `<p style="margin-bottom:10px">${id}: ${data[id].mess}</p>`;
            })
            .join("");
          this.$alert(mesage, "", {
            dangerouslyUseHTMLString: true,
            callback: () => {
              this.fReload();
            }
          });
        })
        .catch(() => {
          this.$message({
            message: "操作失败！",
            type: "info"
          });
        });
    },
    // 删除广告组
    async fDeleteAdgroups() {
      let ids = this.fGetSeletedAdgroupIds();
      let hasError = await this.fCheckAdGroupStatus(ids);
      if (hasError) {
        return;
      }
      fDeleteAdgroup({ idsStr: ids, projectid: this.projectInfo.id }).then((res) => {
        if (res.status == 1 || res.status == 0) {
          this.$message({
            message: res.message,
            type: "success"
          });
          this.fReload();
        } else {
          this.$message({
            message: `广告组:  ${res.data.join(",")} ${res.message}`,
            type: "warning"
          });
        }
      });
    },
    // 导出执行信
    fDownLetter() {
      let ids = this.fGetSeletedAdgroupIds();
      window.location.href = `/d/advertisement/downloadLettersExcel?agids=${ids}`;
    },
    // 取消互斥
    fCancelConflict() {
      this.$confirm("是否取消所选广告组的互斥？", "取消互斥", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let ids = this.fGetSeletedAdgroupIds();
          fCancelAdgroupConflict(ids).then((res) => {
            this.$message({
              message: res.message,
              type: res.status == 0 ? "success" : "error"
            });
            this.fReload();
          });
        })
        .catch(() => {
          this.$message({
            message: "请求异常！",
            type: "info"
          });
        });
    },
    // 下载导入模版
    fDownExportTemplate() {
      let ids = this.fGetSeletedAdgroupIds();
      this.$message({
        message: "正在下载请耐心等待",
        type: "warning"
      });
      fDownExportTemplate(ids).then((res) => {
        if (res.status == "200") {
          let path = res.path;
          window.location.href = `/${path}`;
          return;
        }
        this.$message({
          message: res.errMessage,
          type: "error"
        });
      });
    },
    //批量导出监测
    fDownDetectionTemplate() {
      let ids = this.fGetSeletedAdgroupIds();
      this.$message({
        message: "正在下载请耐心等待",
        type: "warning"
      });
      fDownDetectionTemplate(ids).then((res) => {
        if (res.status == "200") {
          let path = res.path;
          window.location.href = `/${path}`;
          return;
        }
        this.$message({
          message: res.errMessage,
          type: "error"
        });
      });
    },
    // 删除频次
    fDeleteFreq(groupId, freqId) {
      this.$confirm("是否执行删除广告组频次！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        fDelFreq(groupId, freqId).then((res) => {
          this.$message({
            message: res.message || (res.status == 1 ? "删除成功" : "删除失败"),
            type: res.status == 1 ? "success" : "error"
          });
          if (res.status == 1) {
            this.fReload();
          }
        });
      });
    },
    // 点击广告组名称修改关联
    fShowModifyRelated(row) {
      this.$refs.RelatedBpRef.setData(row.id, this.projectInfo.id);
      this.bISModifyRelatedVisible = true;
    },
    // 检查广告组状态
    async fCheckAdGroupStatus(ids) {
      let result = await fCheckAdGroupStatus(ids);
      if (result.data) {
        this.$message({
          message: result.data,
          type: "error"
        });
        return true;
      }
      return false;
    },
    fGetSeletedAdgroupIds() {
      return this.selectedRows
        .map((item) => {
          return item.id;
        })
        .join(",");
    },
    // format
    fFormatName(rowObject, column) {
      let iscopy = rowObject.iscopy;
      let needflight = rowObject.needUpdateFlight; //广告组需要更新投放
      let span = "";
      let color = "";
      if (iscopy && iscopy == 1) {
        span = '<i class="el-icon-notebook-2" style="color:#fe6b45"></i>';
      }
      if (needflight == 1) {
        color = 'style="color: red;font-weight: bolder;"';
      }
      var html = `<a href="javascript:void(0)" agid="${rowObject.id}" name="adgroup_name"> 
        ${span}<span  class="link" ${color}> ${rowObject[column]}</span></a>`;
      return html;
    },
    fFormatPlat(rowObject) {
      let content = rowObject.platsname;
      let style = "";
      if (rowObject.ismodifyverify == 1) {
        //广告组关联的排期包是否被编辑过
        style = 'class="c-red" style="color: red;font-weight: bolder"';
        return "<span " + style + ">" + content + "</span>";
      }
      return content;
    }
  }
};
</script>
<style lang="scss">
.adgroup-page {
  min-width: 1250px !important;
  .selected-row {
    background: oldlace;
  }
  .freq-column .cell {
    overflow: scroll;
    white-space: nowrap;
    text-overflow: initial;
    .el-tag {
      margin-right: 5px;
    }
  }
  .search-right-slot {
    display: inline-block;
    width: 195px;
    margin-left: 10px;
  }
}
.adgroup-popover {
  min-width: 100px;
  .solt-item {
    margin-bottom: 8px;
    // text-align: center;
    cursor: pointer;
    &:last-child {
      margin-bottom: 0;
    }
    &:hover {
      color: #006699;
    }
  }
}
</style>
