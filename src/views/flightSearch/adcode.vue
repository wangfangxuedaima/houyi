<template>
  <div class="page-wraper fullsize-flex adcode-wraper">
    <top-search-bar ref="searchRef" :config="searchList" @fSearch="fSearch"></top-search-bar>
  </div>
</template>
<script>
import { listMixins } from "@/mixins/index";
import TopSearchBar from "@/components/TopSearchBar";
import Vue from "vue";
import axios from "axios";
export default {
  mixins: [listMixins],
  components: { TopSearchBar },
  data() {
    return {
      bIsLoading: false,
      tableData: [],
      searchList: {
        labelWidth: "100px",
        hideenSearchBtn: true,
        // searchNoImmediate: true,
        searchButtons: [
          {
            name: "查询",
            isPlain: true,
            icon: "el-icon-search",
            type: "primary"
          }
        ],
        searchItems: [
          {
            type: "Input",
            prop: "pkgId",
            formItemAttrs: { label: "排期包Id", "label-width": "80px" },
            attrs: { clearable: true, style: "max-width:140px" }
          },
          {
            type: "Select",
            prop: "advFlightTime",
            formItemAttrs: { label: "广告投放时间" },
            attrs: { clearable: true, style: "max-width:140px" },
            data: [],
            filterable: true
          }
        ]
      },
      columns: [
        { prop: "flighttime", label: "投放时间", "min-width": 160 },
        { prop: "flightId", label: "flightId", "min-width": 120 },
        { prop: "ad_code", label: "adCode", width: 360 },
        { prop: "dnf_json", label: "dnfJson", width: 360 },
        { prop: "dnf", label: "dnf", width: 500 }
      ],
      flightList: [],
      searchObject: {
        skuId: ""
      }
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      axios({
        url: "http://localhost:9000/threeList",
        params: {
          pageNum: 1,
          pageSize: 20,
          skuId: ""
        }
      }).then((res) => {
        this.tableData = res.data.rows;
        console.log(res.data.rows);
      });
    },
    fSearch(emitSearchVal) {}
  }
};
</script>
<style scoped lang="scss">
.adcode-wraper {
  min-width: 1000px;
  .el-table__expanded-cell {
    padding: 10px 20px;
  }
  .adcode-detail {
    .label {
      display: inline-block;
      margin: 10px 0;
      font-size: 16px;
      font-weight: 600;
      color: #409eff;
    }
  }
  .show-more {
    padding: 0 10px;
    font-weight: 600;
    color: #409eff;
  }
}
</style>
