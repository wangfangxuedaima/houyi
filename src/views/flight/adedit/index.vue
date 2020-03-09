<template>
  <div class="page-wraper fullsize fullsize-flex adedit-page">
    <top-search-bar ref="searchRef" :config="searchItems" @fSearch="fSearch" @operate="fOperation">
      <el-select slot="search-right" v-model="currentBarTemplate" size="medium">
        <el-option
          v-for="item in curBarTemplateList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </top-search-bar>
    <el-table
      :data="showAdvertisementList"
      class="adver-table"
      @selection-change="fSelectChange"
      v-loading="bIsLoading"
      max-height="500"
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
          <span v-html="$options.filters.render(row, column)"></span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { listMixins } from "@/mixins/index";
import { fDealSearchAreas } from "@/utils/formatter";
import { TempGod } from "./config";

import { fGetBarTemplates, fGetAdgroups, fGetAdvertisiments } from "@/api/flight/adedit";

import TopSearchBar from "@/components/TopSearchBar";
export default {
  mixins: [listMixins],
  components: { TopSearchBar },
  data() {
    let query = this.$route.query;
    return {
      projectId: query.projectid,
      adgroupIds: (query.agids && query.agids.split(",")) || [],
      adverIds: (query.maIds && query.maIds.split(",")) || [],
      plats: [],
      durations: [],
      bIsLoading: true,
      errorTemplates: [],
      barTemplateMap: {}, // 所有模版id对应map
      adgroupMap: {}, // 当前广告组ID和广告组对应map
      curBarTemplateMap: {}, //当前页面广告组所有模版map
      advertisementMap: {}, // 广告 map
      advertisementList: [],
      allAdversimentIds: [], // 所有现有广告id
      currentBarTemplate: "" // 当前选中模版
    };
  },
  computed: {
    curBarTemplateList() {
      return Object.keys(this.curBarTemplateMap).map((id) => {
        let oConfig = this.curBarTemplateMap[id];
        let bIsError = this.errorTemplates.includes(id);
        return {
          value: id,
          label: `${oConfig.name}${bIsError ? "*" : ""}`,
          style: {
            color: bIsError ? "red" : "black"
          }
        };
      });
    },
    searchItems() {
      return {
        labelWidth: "70px",
        topButtons: [{ name: "删除广告" }, { name: "生成goto", pemissionUrl: "" }],
        defaultSearch: {
          placeholder: "搜索内容后请敲回车键...",
          key: "FCNBSearch" // 默认的搜索字段
        },
        searchItems: [
          {
            type: "Input",
            prop: "searchGroupName",
            formItemAttrs: { label: "广告组名称", "label-width": "75px" },
            attrs: { clearable: true, style: "width:120px" }
          },
          {
            type: "Input",
            prop: "searchGodName",
            formItemAttrs: { label: "广告名称" },
            attrs: { clearable: true, style: "width:120px" }
          },
          {
            type: "Select",
            prop: "searchArea",
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
            type: "Input",
            prop: "searchMaterialId",
            formItemAttrs: { label: "物料id" },
            attrs: { clearable: true, style: "width:120px" }
          },
          {
            type: "Select",
            prop: "searchDelay",
            default: "",
            formItemAttrs: { label: "广告时长" },
            attrs: { placeholder: "请选择", clearable: true, style: "max-width:100px" },
            data: this.durations
          },
          {
            type: "Select",
            prop: "searchPlat",
            default: "",
            formItemAttrs: { label: "平台" },
            attrs: { placeholder: "请选择", clearable: true, style: "max-width:120px" },
            data: this.plats
          },
          {
            type: "CheckBox",
            prop: "searchJs",
            default: "0",
            formItemAttrs: { label: "匹配地域 " },
            attrs: { "true-label": "1", "false-label": "0" }
          }
        ]
      };
    },
    columns() {
      return [
        {
          prop: "id",
          label: "广告组ID",
          "min-width": 60,
          fixed: "left",
          formatter(rowObject) {
            return !rowObject.__bIsTemp ? rowObject.id : "";
          }
        },
        {
          prop: "name",
          label: "广告名称",
          "min-width": 200,
          formatter(rowObject) {
            return rowObject.group.name;
          }
        },
        {
          prop: "platName",
          label: "平台",
          "min-width": 80,
          formatter(rowObject) {
            return rowObject.group.platName;
          }
        },
        {
          prop: "area",
          label: "地域",
          "min-width": 80,
          formatter(rowObject) {
            return rowObject.group.area;
          }
        },
        {
          prop: "resource",
          label: "内容",
          "min-width": 120,
          formatter(rowObject) {
            return rowObject.group.resource;
          }
        },
        {
          prop: "duration",
          label: "广告时长",
          "min-width": 80,
          formatter(rowObject) {
            return rowObject.group.duration;
          }
        },
        {
          prop: "adstyleName",
          label: "广告形式",
          "min-width": 80,
          formatter(rowObject) {
            return rowObject.group.adstyleName;
          }
        },
        {
          prop: "type",
          label: "广告类型",
          "min-width": 80,
          formatter(rowObject) {
            let map = { 0: "普通线", 1: "事故线" };
            return map[rowObject.type] || "未知";
          }
        },
        { prop: "note", label: "备注", "min-width": 80 }
      ];
    },
    showAdvertisementList() {
      return this.advertisementList.filter((adver) => {
        return adver.group.templateId === this.currentBarTemplate;
      });
    }
  },
  async created() {
    await this.fGetAllBarTemplateList();
    await this.fGetGroupList();
    await this.fGetAdvertisimentList();
  },
  methods: {
    // 获取所有模版并处理成id对应关系
    fGetAllBarTemplateList() {
      fGetBarTemplates().then((res) => {
        let barTemplateList = res.rows || [];
        barTemplateList.forEach((template) => {
          this.barTemplateMap[template.id] = template;
        });
      });
    },
    // 获取广告组列表
    fGetGroupList() {
      fGetAdgroups(this.adgroupIds).then((res) => {
        if (res && res.rows) {
          let barTemplateMap = {}; // 临时
          res.rows.forEach((group) => {
            let adStyle = group.adstyle || "oad";
            let dealGroup = {
              ...group,
              templateId: group.templateId || `${adStyle}_1`,
              godTemplate: JSON.parse(group.godtemplate && group.godtemplate.template)
            };
            this.adgroupMap[group.id] = dealGroup;
            barTemplateMap[dealGroup.templateId] = dealGroup.godTemplate;
          });
          this.curBarTemplateMap = { ...barTemplateMap };
          // 默认选中第一个模版
          if (Object.keys(barTemplateMap).length > 0) {
            this.currentBarTemplate = Object.keys(barTemplateMap)[0];
          }
        }
      });
    },
    // 获取广告信息
    fGetAdvertisimentList() {
      fGetAdvertisiments(this.adgroupIds, this.adverIds).then((res) => {
        let rows = res.rows || [];
        rows.forEach((adver) => {
          let group = this.adgroupMap[adver.groupid];
          if (group) {
            let barTemplate = this.barTemplateMap[group.bartempletid];
            let other = group.godTemplate ? this.fDealAdverOther(group.godTemplate) : {};
            let curMaiterial = {
              ...adver,
              ...other,
              group: group,
              starttimeTemp: adver.starttime, // 用于保存时判断
              endtimeTemp: adver.endtime,
              barTemplate: barTemplate,
              barconfig: JSON.parse(barTemplate && barTemplate.config) || {}
            };
            this.allAdversimentIds.push(adver.id);
            this.advertisementList.push(curMaiterial);
            // adverAdgroup.__bHasAdver = true;
          }
          if (!group) {
            // console.log("null group", adver.groupid);
          }
        });

        let platSet = new Set();
        let durationSet = new Set();
        // 无广告的广告组创建一条临时广告
        Object.keys(this.adgroupMap).forEach((key) => {
          let group = this.adgroupMap[key];
          if (!group.__bHasAdver) {
            let barTemplate = this.barTemplateMap[group.bartempletid];
            let other = group.godTemplate ? this.fDealAdverOther(group.godTemplate) : {};
            let temAdver = {
              ...TempGod,
              ...other,
              group: group,
              id: `${group.id}_${Date.now()}`,
              barTemplate: barTemplate,
              barconfig: JSON.parse(barTemplate && barTemplate.config) || {},
              __bIsTemp: true
            };
            this.advertisementList.push(temAdver);
          }
          // 平台和广告时长筛选项
          let platName = group.platName;
          if (!platSet.has(platName)) {
            platSet.add(platName);
            this.plats.push({ datavalue: platName, dataname: platName });
          }
          let duration = group.duration;
          if (duration > 0 && !durationSet.has(duration)) {
            durationSet.add(duration);
            this.durations.push({ datavalue: duration, dataname: duration });
          }
        });
        this.advertisementList.forEach((item) => {
          this.advertisementMap[item.id] = item;
          if (item.barconfig && item.barconfig.clickMonitor) {
            if (item.mclickstatistics) {
              let arr = item.mclickstatistics.split("#|#");
              item.mclickstatistics = arr[arr.length - 1];
            }
          }
        });
        this.bIsLoading = false;
        //console.log(this.advertisementList);
      });
    },
    fDealAdverOther(godTemplate) {
      let barconfig = godTemplate.barconfig || {};
      return {
        adtemplate: godTemplate.adtemplate || null,
        haveFloatMaterial: barconfig.haveFloatMaterial || null,
        topview: barconfig.topview || null,
        haveLinkMaterial: barconfig.haveLinkMaterial || null
      };
    },
    fSearch() {},
    fOperation() {},
    fSelectChange() {}
  }
};
</script>
<style lang="scss">
.adedit-page {
  min-width: 0;
  .search-right-slot {
    width: 260px;
    .el-select {
      width: 260px;
    }
  }
  .el-table .cell {
    line-height: 40px;
  }
}
</style>
