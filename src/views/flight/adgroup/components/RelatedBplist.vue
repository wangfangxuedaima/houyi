<template>
  <el-dialog title="查看关联排期包列表" :visible.sync="bIsVisible" width="1000px" class="related-adgroup-dia">
    <el-button @click="fChangeRealted" type="primary" size="mini" plain class="change-related">修改关联</el-button>
    <pagination-pro
      class="pagination-bottom"
      ref="tableRef"
      method="post"
      :autoload="false"
      :page-size="15"
      :url="'/d/bookpkg/listbygroup'"
      :params="{ id: adgroupId }"
      :loading.sync="bIsLoading"
      v-loading="bIsLoading"
    >
      <template slot-scope="{ data }">
        <el-table :data="data" class="related-table" border>
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
import * as formatterUtil from "@/utils/formatter";
import * as constantData from "@/utils/constant";
import { listMixins } from "@/mixins/index";
export default {
  mixins: [listMixins],
  data() {
    return {
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
      adgroupId: "",
      projectId: ""
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
    }
  },
  methods: {
    setData(adgroupId, projectId) {
      this.adgroupId = adgroupId;
      this.projectId = projectId;
      this.fReload();
    },
    fReload() {
      this.$nextTick(() => {
        this.$refs.tableRef.fReload();
      });
    },
    fChangeRealted() {
      this.bIsVisible = false;
      this.$router.push({
        path: `/flight/advproject/adgroup/bplist`,
        query: { projectid: this.projectId, adgroupid: this.adgroupId }
      });
    }
  }
};
</script>
<style lang="scss">
.related-adgroup-dia {
  .change-related {
    margin-bottom: 10px;
  }
  .related-table {
    height: 300px;
    overflow: scroll;
  }
}
</style>
