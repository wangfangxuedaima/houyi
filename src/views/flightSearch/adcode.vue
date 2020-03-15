<template>
  <div class="page-wraper fullsize-flex adcode-wraper">
    <div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="skuId">
          <el-input v-model="formInline.skuId" placeholder="skuId"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="toExcel">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table :data="tableData" style="width: 100%" border>
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
      </el-table>
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage1"
          :page-size="100"
          layout="total, prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>
    </div>
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
      formInline: {
        skuId: ""
      },
      bIsLoading: false,
      currentPage1: 1,
      tableData: [],
      columns: [
        { prop: "id", label: "ID值", "min-width": 160 },
        { prop: "Brand", label: "商品品牌", "min-width": 120 },
        { prop: "Name", label: "商品名称", width: 360 },
        // { prop: "Categories", label: "商品描述", width: 160 },
        { prop: "sex", label: "性别", width: 160 },
        { prop: "skuId", label: "skuId", width: 260 },
        { prop: "Categories", label: "商品描述", width: 160 },
        // { prop: "Categories", label: "一级分类", width: 160 },
        // { prop: "Categories", label: "商品分类", width: 160 },
        { prop: "MadeIn", label: "产地", width: 160 },
        { prop: "Material", label: "材质", width: 300 },
        { prop: "Season", label: "季节", width: 300 },
        { prop: "Color", label: "颜色", width: 300 },
        { prop: "RetailPrice", label: "欧洲市场价", width: 300 },
        { prop: "size", label: "尺寸", width: 200 },
        { prop: "Qty", label: "可售库存", width: 100 },
        { prop: "sizeAndFit", label: "各类尺码", width: 100 },
        { prop: "url1", label: "url1", width: 100 },
        { prop: "url2", label: "url2", width: 100 },
        { prop: "url3", label: "url3", width: 100 },
        { prop: "url4", label: "url4", width: 100 },
        { prop: "updateTime", label: "更新时间", width: 300, filter: "time" }
      ],
      flightList: [],
      searchObject: {
        skuId: ""
      },
      pageNum: 1,
      pageSize: 20,
      total: 1
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      axios({
        url: "http://123.56.228.134:8080/threeList",
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          skuId: this.formInline.skuId
        },
        timeout: 10000
      })
        .then((res) => {
          this.tableData = res.data.rows;
          this.total = res.data.records;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageNum = val;
      this.getData();
    },
    onSubmit() {
      this.getData();
    },
    toExcel() {
      window.location = "http://123.56.228.134:8080/csv/three.csv";
    }
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
.pagination {
  text-align: center;
  padding: 20px;
}
</style>
