<template>
  <el-dialog title="" :visible.sync="bIsVisible" width="1100px" class="conflict-view-dia">
    <div class="confilct-list">
      <top-search-bar
        ref="searchRef"
        :config="searchItems"
        @fSearch="fSearch"
        @operate="fOperation"
        @fGetEmitSearchObj="fGetEmitSearchObj"
      ></top-search-bar>
      <pagination-pro
        class="pagination-top"
        ref="conflictRef"
        method="post"
        :autoload="false"
        :page-size="15"
        :url="'/d/conflictad/list'"
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
    <div class="selected-confilct-list" v-if="this.adgroupIds.length === 1">
      <div class="title" style="margin-bottom:10px">
        <label style="margin-right:15px;">已关联</label>
        <el-button @click="fDelete" type="info" size="mini" plain>删除</el-button>
      </div>
      <pagination-pro
        class="pagination-bottom"
        ref="hasConflictRef"
        method="post"
        :autoload="false"
        :page-size="15"
        :url="'/d/conflictad/listselected'"
        :params="searchConflictedObject"
        :loading.sync="bIsBottomLoading"
        v-loading="bIsBottomLoading"
        :onResponse="fOnConflictedResponse"
      >
        <template slot-scope="{ data }">
          <el-table :data="data" class="conflict-table" @selection-change="fSelectConflictedChange" border>
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
    </div>
  </el-dialog>
</template>
<script>
import { fDealSearchAreas } from "@/utils/formatter";
import { fSaveOrUpdateConfict } from "@/api/flight/adgroup";
import TopSearchBar from "@/components/TopSearchBar";
import { listMixins } from "@/mixins/index";
export default {
  mixins: [listMixins],
  inject: ["routerRefresh"], //在子组件中注入在父组件中创建的属性
  components: { TopSearchBar },
  data() {
    return {
      columns: [
        {
          prop: "id",
          label: "广告组ID",
          "min-width": 80,
          formatter: (rowObject) => {
            return rowObject.id || "*";
          }
        },
        { prop: "name", label: "广告组名称", "min-width": 220 },
        { prop: "platName", label: "平台", "min-width": 100 },
        { prop: "adstyleName", label: "广告形式", "min-width": 100 },
        { prop: "area", label: "地域定向", "min-width": 160 }
      ],
      adgroupIds: [],
      projectNumber: "",
      searchObject: { number: "" },
      searchConflictedObject: {},
      addList: [],
      delList: [],
      allConflictedId: [],
      bIsLoading: false,
      bIsBottomLoading: false
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false
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
    },
    searchItems() {
      return {
        labelWidth: "75px",
        searchItems: [
          {
            type: "Input",
            prop: "number",
            default: this.projectNumber,
            formItemAttrs: { label: "执行单号" },
            attrs: { clearable: true, style: "width:200px" }
          },
          {
            type: "Select",
            prop: "adstyle",
            default: "",
            formItemAttrs: { label: "广告形式" },
            attrs: { placeholder: "广告形式", clearable: true, style: "max-width:120px" },
            data: [
              { datavalue: "", dataname: "请选择" },
              { datavalue: "1", dataname: "前贴片" },
              { datavalue: "2", dataname: "中插片" }
            ]
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
              style: "max-width:180px"
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
            prop: "id",
            formItemAttrs: { label: "广告组ID" },
            attrs: { clearable: true, style: "width:120px" }
          },
          {
            type: "Input",
            prop: "name",
            formItemAttrs: { label: "广告组名称" },
            attrs: { clearable: true, style: "width:120px" }
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
            type: "CheckBox",
            prop: "needCheckArea",
            default: "0",
            formItemAttrs: { label: "匹配地域 " },
            attrs: {
              "true-label": "1",
              "false-label": "0"
            }
          }
        ],
        searchButtons: [
          { name: "查询" },
          { name: "冲突所有" },
          { name: "设置", attrs: { disabled: this.addList.length === 0 } }
        ]
      };
    }
  },
  methods: {
    fReload() {
      this.$nextTick(() => {
        this.$refs.conflictRef.fReload();
      });
    },
    fConflictedReload() {
      this.$nextTick(() => {
        this.$refs.hasConflictRef.fReload();
      });
    },
    setConflictData(projectNumber, adgroupIds) {
      this.adgroupIds = adgroupIds;
      this.projectNumber = projectNumber;
      this.fSearch();
      // 只选择一个
      if (this.adgroupIds.length === 1) {
        this.searchConflictedObject = {
          id: this.adgroupIds[0]
        };
        this.fConflictedReload();
      }
    },
    fSearch(val = {}) {
      this.searchObject = {
        ...val,
        number: this.projectNumber,
        areaCodes: (val.areaCodes && val.areaCodes.join(",")) || ""
      };
      this.fReload();
    },
    // 为方便获取匹配地域
    fGetEmitSearchObj(val) {
      this.searchObject = {
        ...val,
        number: this.projectNumber,
        areaCodes: val.areaCodes.join(",")
      };
    },
    fDelete() {
      this.fSaveOrUpdateConfict(this.delList, "update");
    },
    fOperation(btn) {
      if (btn.name === "冲突所有") {
        this.fSaveOrUpdateConfict(["*"], "add");
      }
      if (btn.name === "设置") {
        this.fSaveOrUpdateConfict(this.addList, "add");
      }
    },
    fSaveOrUpdateConfict(ids, type) {
      if (type === "add" && ids.length === 0) {
        return;
      }
      let data = {
        groupidstr: this.adgroupIds.join(","),
        idsStr: ids.join(","),
        needCheckArea: this.searchObject.needCheckArea || 0
      };
      fSaveOrUpdateConfict(data, type).then((res) => {
        this.$message({ message: res.message, type: res.status == 0 ? "success" : "error" });
        if (res.status == 0 && this.adgroupIds.length === 1) {
          this.fConflictedReload();
        }
      });
    },
    fSelectChange(data) {
      this.addList = data.map((item) => {
        return item.id;
      });
    },
    fSelectConflictedChange(data) {
      this.delList = [];
      let allIds = [...this.allConflictedId];
      let selectedIs = data.map((item) => {
        return item.id;
      });
      allIds.forEach((id) => {
        if (!selectedIs.includes(id)) {
          this.delList.push(id == 0 ? "*" : id);
        }
      });
      //   console.log(this.delList);
    },
    fOnConflictedResponse(data) {
      this.allConflictedId = (data.rows || []).map((item) => {
        return item.id;
      });
    }
  }
};
</script>
<style lang="scss">
.conflict-view-dia {
  .el-dialog__header {
    padding: 5px 0 0;
  }
  .pagination-top {
    .conflict-table {
      height: 200px;
      overflow: scroll;
    }
    .pagination-conainer {
      margin: 5px 0 0 0;
    }
  }
  .pagination-bottom {
    .conflict-table {
      height: 160px;
      overflow: scroll;
    }
    .pagination-conainer {
      display: none;
    }
  }
}
</style>
