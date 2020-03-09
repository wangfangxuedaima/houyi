<template>
  <div class="page-wraper fullsize fullsize-flex viewflight-wraper">
    <h2 style="font-size: 20px">
      当前执行单号:
      <span style="color: green">FHTV-BJ-20-00001#M002tv</span>
    </h2>
    <div class="top">
      <p class="fz10" style="margin-bottom: 10px">
        <el-button plain size="mini" type="danger" @click="deleteCon">删除</el-button>
        已设置冲突执行单列表
      </p>
      <pagination-pro
        class="mg-t-10 tableList"
        ref="pageRef1"
        :loading.sync="bIsLoading1"
        :autoload="false"
        :fullsize="true"
        :page-size="20"
        :page-sizes="[20, 50, 100, 200]"
        layout="sizes, prev, pager, next, ->, total"
        :url="'d/proconflict/list'"
        :params="searchObject1"
        method="post"
      >
        <template v-slot="{ data }">
          <el-table v-loading="bIsLoading1" :data="data" @selection-change="handleSelectionChange1" border>
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
    <div class="bottom">
      <p class="fz10">
        待设置冲突执行单:
        <span>(查询结果中不包含已经设置为冲突的执行单)</span>
      </p>
      <top-search-bar ref="searchRef" :config="searchItems" @operate="fOperate" @fSearch="fSearch"></top-search-bar>
      <pagination-pro
        class="mg-t-10 tableList"
        ref="pageRef"
        :loading.sync="bIsLoading"
        :autoload="true"
        :fullsize="true"
        :page-size="20"
        :page-sizes="[20, 50, 100, 200]"
        layout="sizes, prev, pager, next, ->, total"
        :url="'d/proconflict/searchlist'"
        :params="searchObject"
        method="post"
      >
        <template v-slot="{ data }">
          <el-table v-loading="bIsLoading" :data="data" @selection-change="handleSelectionChange" border>
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
  </div>
</template>

<script>
import { opproconflict, getAdNamelist } from "@/api/flight/filght-list";
import TopSearchBar from "@/components/TopSearchBar";
import { listMixins } from "@/mixins";
export default {
  name: "viewFlight",
  components: { TopSearchBar },
  mixins: [listMixins],
  data() {
    return {
      id: this.$route.params.id,
      momentList: [],
      momentList1: [],
      adNameList: [],
      columns: [
        { prop: "id", label: "Id" },
        { prop: "name", label: "执行单号" },
        { prop: "advertisername", label: "广告主" },
        { prop: "productlinename", label: "产品线" },
        { prop: "starttime", label: "开始时间", filter: "date" },
        { prop: "endtime", label: "结束时间", filter: "date" }
      ],
      bIsLoading: false,
      bIsLoading1: false,
      searchObject: {
        id: this.id || 12396
      },
      searchObject1: {
        projectId: this.id || 12396,
        _search: false
      },
      searchItems: {
        labelWidth: "75px",
        hideenSearchBtn: true,
        searchButtons: [{ name: "查询" }, { name: "设置冲突" }],
        searchItems: [
          {
            type: "Input",
            prop: "number",
            formItemAttrs: { label: "执行单号" },
            attrs: {
              clearable: true,
              style: "width:150px"
            }
          },
          {
            type: "el-autocomplete",
            prop: "advertisername",
            disabled: true,
            formItemAttrs: { label: "广告主" },
            attrs: { clearable: true, style: "width:150px", "fetch-suggestions": this.querySearchAsync }
          }
        ]
      }
    };
  },
  created() {
    this.fReload();
    this.fReload1();
    console.log(this.$route.params.id);
  },
  async mounted() {
    this.adNameList = await getAdNamelist();
  },
  methods: {
    deleteCon() {
      let conflictIds = this.momentList1.map((v) => v.id).join(",");
      if (conflictIds.length === 0) {
        this.$message.error("删除执行单冲突功能，请至少选择一个执行单");
      }
      opproconflict({ conflictIds, projectId: this.id, opType: "delete" }).then((res) => {
        if (+res.status === 0) {
          this.fReload();
          this.fReload1();
        }
      });
    },
    fOperate(btn) {
      switch (btn.name) {
        case "设置冲突":
          let conflictIds = this.momentList.map((v) => v.id).join(",");
          if (conflictIds.length === 0) {
            this.$message.error("设置执行单冲突功能，请至少选择一个执行单");
          }
          opproconflict({ conflictIds, projectId: this.id, opType: "add" }).then((res) => {
            console.log(res);
            if (+res.status === 0) {
              this.fReload();
              this.fReload1();
            } else {
              this.$message.error(res.message);
            }
          });
          break;
      }
    },
    fReload() {
      this.$nextTick(() => {
        this.$refs.pageRef.fReload();
      });
    },
    fReload1() {
      this.$nextTick(() => {
        this.$refs.pageRef1.fReload();
      });
    },
    fSearch(val) {
      this.searchObject = { ...this.searchObject, ...val };
      this.fReload();
    },
    querySearchAsync(val, cb) {
      let result = this.adNameList.filter((v) => v.name.includes(val));
      cb(result);
    },
    handleSelectionChange(val) {
      this.momentList = val;
    },
    handleSelectionChange1(val) {
      this.momentList1 = val;
    }
  }
};
</script>

<style lang="scss" scoped>
.top,
.bottom {
  height: 300px;
}
.fz10 {
  font-size: 10px;
  span {
    color: red;
  }
}
.tableList {
  height: 250px;
  overflow: scroll;
}
</style>
