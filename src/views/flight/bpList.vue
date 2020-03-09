<template>
  <div class="page-wraper fullsize fullsize-flex advproject-page">
    <div class="card">
      <top-search-bar ref="searchRef" :config="searchItems" @operate="foperate(arguments)"></top-search-bar>
      <top-search-bar ref="searchRef2" :config="searchItems2" @fSearch="fSearch2"></top-search-bar>
    </div>
    <pagination-pro
      class="mg-t-10 grow-1"
      ref="pageRef"
      :loading.sync="bIsLoading"
      :autoload="false"
      :fullsize="true"
      :page-size="15"
      :url="'d/advbookpkg/list'"
      :params="searchObject"
    >
      <template slot-scope="{ height }">
        <el-table
          v-loading="bIsLoading"
          :data="advbookpkgList"
          :height="height"
          header-cell-class-name="table-header"
          @selection-change="handleSelectionChange"
          @row-click="fClickRow"
          :row-class-name="tableRowClassName"
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
              <span>{{ row | render(column) }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" align="center" label="模板类型" width="250px" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <el-select v-model="row.styleArrVal" placeholder="请选择">
                <el-option
                  v-for="item in row.styleArr"
                  :key="item.templateId"
                  :label="item.name"
                  :value="item.templateId"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </pagination-pro>
    <el-dialog title="拆包选项" :visible.sync="dialogFormVisible">
      <el-form :model="unpack">
        <el-form-item label="拆包维度" label-width="100px">
          <el-radio-group v-model="unpack.resource">
            <el-radio label="按排期拆包"></el-radio>
            <el-radio label="自定义拆包"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="广告组后缀" label-width="100px">
          <el-input v-model="unpack.name" aria-placeholder="广告组后缀"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="doUnPack">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import TopSearchBar from "@/components/TopSearchBar";
import { listMixins } from "@/mixins/index";
import { listChannel } from "../utils/index";
import {
  fGetadvbookpkg,
  fgetAdstyle,
  fgetTime,
  getPlatList,
  getTemplates,
  saveGroup,
  getPkgDirectList
} from "@/api/flight/bpList";
export default {
  name: "bpList",
  mixins: [listMixins],
  components: { TopSearchBar },
  data() {
    return {
      advbookpkgList: [],
      hangleSections: [],
      parameter: {},
      unpack: {},
      dialogFormVisible: false,
      searchItems: {
        labelWidth: "75px",
        searchItems: [
          {
            type: "Input",
            prop: "adgroupname",
            formItemAttrs: { label: "广告组名称" },
            attrs: {
              clearable: true,
              style: "width:150px"
            }
          },
          {
            type: "Input",
            prop: "sufffix",
            formItemAttrs: { label: "广告组后缀" },
            attrs: {
              clearable: true,
              style: "width:150px"
            }
          },
          {
            type: "Select",
            prop: "adgrouptype",
            default: "0",
            formItemAttrs: { label: "广告组类型", "label-width": "80px" },
            attrs: { placeholder: "广告组类型", style: "max-width:150px" },
            data: [
              { datavalue: "0", dataname: "普通线" },
              { datavalue: "1", dataname: "故事线" }
            ]
          }
        ],
        searchButtons: [{ name: "保存" }, { name: "拆包" }, { name: "未拆包排期包" }]
      },
      searchItems2: {
        labelWidth: "75px",
        defaultSearch: {
          placeholder: "搜索内容后请敲回车键...",
          key: "FCNBSearch", // 默认的搜索字段
          label: "所有排期包"
        },
        searchItems: [
          {
            type: "Input",
            prop: "pkgname",
            formItemAttrs: { label: "排期包名称" },
            attrs: {
              clearable: true,
              style: "width:150px"
            }
          },
          {
            type: "Select",
            prop: "basedata_type_adstyle",
            formItemAttrs: { label: "广告形式" },
            attrs: {
              clearable: true,
              style: "width:150px"
            },
            dataConfig: {
              optionName: "name",
              optionValue: "code"
            },
            data: []
          },
          {
            type: "Select",
            prop: "duration",
            formItemAttrs: { label: "广告时长" },
            attrs: {
              clearable: true,
              style: "width:150px"
            },
            data: []
          },
          {
            type: "Select",
            prop: "queryPlatId",
            formItemAttrs: { label: "平台" },
            attrs: {
              clearable: true,
              style: "width:150px",
              multiple: true,
              "collapse-tags": true
            },
            dataConfig: {
              optionName: "platname",
              optionValue: "ccode"
            },
            data: []
          },
          {
            type: "Select",
            prop: "usetype",
            formItemAttrs: { label: "使用属性" },
            attrs: {
              clearable: true,
              style: "width:150px"
            },
            data: [
              { dataname: "售卖", datavalue: "1" },
              { dataname: "配送", datavalue: "2" },
              { dataname: "补偿", datavalue: "3" },
              { dataname: "推广", datavalue: "4" },
              { dataname: "补量", datavalue: "5" }
            ]
          },
          {
            type: "Input",
            prop: "areaDirectSpace",
            triggerFocus: true,
            formItemAttrs: { label: "地域定向" },
            attrs: {
              clearable: true,
              style: "width:150px"
            }
          },
          {
            type: "DataPicker",
            prop: "searchTimeStart",
            startTimeKey: "starttime",
            endTimeKey: "endtime",
            formItemAttrs: { label: "投放日期" },
            attrs: {
              clearable: true,
              style: "width:350px",
              type: "daterange",
              "start-placeholder": "开始日期",
              "end-placeholder": "结束日期",
              format: "yyyy-MM-dd",
              "value-format": "yyyy-MM-dd"
            }
          },
          {
            type: "Input",
            prop: "searchNote",
            formItemAttrs: { label: "备注" },
            attrs: {
              clearable: true,
              style: "width:150px"
            }
          }
        ]
      },
      GodTemplateConfig: {},
      bIsLoading: false,
      searchObject: {
        projectid: 12386
      },
      curentSelect: "",
      columns: [
        { prop: "id", label: "排期包ID", "min-width": 80, fixed: "left" },
        { prop: "pkgname", label: "排期包名称", "min-width": 180 },
        { prop: "platname", label: "平台", "min-width": 180 },
        { prop: "cpmResourceName", label: "内容", "min-width": 120 },
        { prop: "hdName", label: "小时/分钟", "min-width": 110 },
        { prop: "areaName", label: "地域", "min-width": 110 },
        { prop: "duration", label: "广告时长", "min-width": 120 },
        { prop: "adStyleName", label: "广告形式", "min-width": 130 },
        { prop: "createTime", label: "创建时间", filter: "time", "min-width": 130 },
        { prop: "saletypeName", label: "售卖方式" },
        { prop: "note", label: "备注" },
        { prop: "timearea", label: "投放时间" },
        { prop: "usetype", label: "使用属性", filter: "usetype" },
        { prop: "realprice", label: "折后单价" }
      ]
    };
  },
  watch: {},
  created() {
    // 获取全部的模板
    this.getTemplates();
    this.fGetadvbookpkg();
    // 获取字典表信息
    this.getAllDict();
    //初始化拆包对象
    // this.initSplitObj(pid, bpids);
  },
  methods: {
    fReload() {
      this.$nextTick(() => {
        this.$refs.pageRef.fReload();
      });
    },
    async fGetadvbookpkg(params) {
      let data = await fGetadvbookpkg(Object.assign({ projectid: 12386 }, params));
      this.advbookpkgList = data.rows;
      data.rows.forEach((v) => {
        let allstyleArr = [];
        let keys = Object.keys(this.GodTemplateConfig);
        keys.forEach((k) => {
          let template = this.GodTemplateConfig[k];
          if (k.startsWith(v.adStyle + "_", 0) && template.plats.split(",").indexOf(v.plat.toString()) > -1) {
            template["templateId"] = k;
            allstyleArr.push(template);
          }
        });
        /**
          联动广告：只展示联动广告的4个模板
          可跳广告：只展示可跳广告模板
          可选广告：只展示可选广告模板
          其他广告类型，广告模板只展示普通的，不展示上面三种特殊的
          **/
        if (v.activeAdType) {
          v.styleArr = allstyleArr.filter((i) => +i.activeAdType === v.activeAdType);
        } else {
          v.styleArr = allstyleArr.filter((i) => !i.activeAdType);
        }
        //2019-01-07新增需求
        //广告形式为通栏时 （ba），验证广告模板中的广告位要包含（即>=）此排期包的广告位。 todo
        // 目前还有一个通栏 多了一个 橱窗广告模板 （它的modulepostcode 是sw_1 不是一个数组）
        // 20200302 将数组中activeAdType 为null的过滤出来 返回到前台页面
      });
    },
    getAllDict() {
      let searchObjs = this.searchItems2.searchItems;
      Promise.all([fgetAdstyle(), fgetTime(), getPlatList()]).then(([adTypes, adTimes, plats]) => {
        let adStyleItem = this.findSearchItem(searchObjs, "basedata_type_adstyle");
        let timeItem = this.findSearchItem(searchObjs, "duration");
        let platItem = this.findSearchItem(searchObjs, "queryPlatId");
        this.$set(adStyleItem, "data", JSON.parse(adTypes));
        this.$set(timeItem, "data", JSON.parse(adTimes));
        this.$set(platItem, "data", JSON.parse(plats));
      });
    },
    async getTemplates() {
      let templates = await getTemplates();
      templates.forEach((v) => {
        this.GodTemplateConfig[v.keyid] = JSON.parse(v.template);
        this.GodTemplateConfig[v.keyid].activeAdType = v.activeAdType;
      });
    },
    onSubmit() {},
    fClickRow(row) {
      this.curentSelect = row;
    },
    findSearchItem(data, prop) {
      if (!Array.isArray(data)) return;
      return data.find((item) => item.prop === prop);
    },
    foperate(rest) {
      if (rest[0].name === "保存") {
        this.fsave(rest[1]);
      }
      if (rest[0].name === "未拆包排期包") {
        this.fSearchTable();
      }
      if (rest[0].name === "拆包") {
        this.unpackage();
      }
    },
    fsave(data) {
      if (this.hangleSections.length === 0) {
        this.$message.error("请选择要关联的排期包");
      } else {
        // 检测选择的排期包的广告形式是否一样
        let equal = this.isEqual(this.hangleSections, "styleArrVal");
        if (equal) {
          if (this.hangleSections[0].adStyle !== "oad" && data.adgrouptype === "1") {
            this.$message.error("只有前贴片的排期包可以管理故事线广告组，以下排期包不符合要求");
          }
          let bpids = this.hangleSections.map((v) => v.id).join(",");
          this.parameter = {
            bpids,
            projectid: 12386,
            templateId: this.hangleSections[0].styleArrVal,
            name: data.adgroupname || "",
            type: data.adgrouptype || "",
            suffix: data.sufffix || ""
          };
          saveGroup(this.parameter)
            .then((res) => {
              if (res.status === 0) {
              } else {
                this.$message.error(res.message);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          this.$message.error("选择的排期包广告形式不同");
        }
      }
    },
    fSearchTable() {
      this.searchObject = Object.assign(this.searchObject, { isRGroup: 1 });
      this.fGetadvbookpkg(this.searchObject);
    },
    // 点击拆包按钮
    unpackage() {
      if (this.hangleSections.length === 0) {
        this.$message.error("请选择要拆的排期包");
      } else {
        this.dialogFormVisible = true;
        let ids = this.hangleSections.map((v) => v.id).join(",");
        let _id = this.projectid || 12396; //
        let splitObj = this.initSplitObj(_id, ids);
      }
    },
    // 执行拆包操作
    async doUnPack() {},
    async initSplitObj(_id, ids) {
      var splitObj = {};
      //平台,形式,时长必拆
      splitObj["byPlat"] = 1;
      splitObj["byAdStyle"] = 1;
      splitObj["byDuration"] = 1;
      splitObj["projectid"] = _id;
      splitObj["bpids"] = ids;
      splitObj["groupType"] = this.groupType; // 普通线  故事线
      splitObj["splitType"] = this.split_type || ""; // 拆包类型 自定义拆包 还是按照排期包拆包
      let bp = await getPkgDirectList(_id, ids);
      console.log(bp);
      let { resMap, plat, adstyles, durations } = bp;
      // 对应老代码 1590行
    },
    isEqual(array, property) {
      return array.every((cur) => {
        return cur[property] === array[0][property];
      });
    },
    handleSelectionChange(val) {
      this.hangleSections = val;
    },
    fSearch2(data) {
      let {
        pkgname,
        basedata_type_adstyle: adStyle,
        duration,
        usetype,
        note,
        queryPlatId,
        starttime,
        endtime,
        FCNBSearch
      } = data;
      this.searchObject = {
        pkgname,
        adStyle,
        duration,
        usetype,
        note,
        platCodes: queryPlatId.join(),
        starttime,
        endtime,
        FCNBSearch
      };
      this.fGetadvbookpkg(this.searchObject);
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
<style lang="scss" scoped>
.card {
  margin-bottom: 10px;
  padding-bottom: 20px;
}
</style>
