<template>
  <div class="flight-dia-wraper">
    <el-dialog :title="checkRespnoseData.message" :visible.sync="bIsShowConfirm" width="800px">
      <el-table :data="confirmData" class="fligth-table" border>
        <el-table-column align="center" v-for="column in confirmColumns" v-bind="column" :key="column.prop">
          <template slot-scope="{ row }">
            <span v-html="$options.filters.render(row, column)"></span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bIsShowConfirm = false" type="info" size="small" plain>否</el-button>
        <el-button @click="fConfirm" :loading="bIsLoadingConfirm" type="primary" size="small" plain>是</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="将要投放的广告组与以下广告组关联了相同排期包，是否要设置冲突广告组？"
      :visible.sync="bIsShowSetConflict"
      width="800px"
    >
      <el-table :data="conflictData" class="fligth-table" border>
        <el-table-column align="center" v-for="column in conflictColumns" v-bind="column" :key="column.prop">
          <template slot-scope="{ row }">
            <span v-html="$options.filters.render(row, column)"></span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="fNoSetConflict" type="info" size="small" plain>否</el-button>
        <el-button @click="fSetConflict" type="primary" size="small" plain>是</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { fCheckConflictAdgroup, fFlightAdgroup, setConflictAd } from "@/api/flight/adgroup";
export default {
  props: {
    adgroups: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      confirmColumns: [
        { prop: "advId", label: "广告ID", "min-width": 60 },
        { prop: "adGroupId", label: "广告组ID", "min-width": 60 },
        { prop: "content", label: "内容", "min-width": 200 }
      ],
      conflictColumns: [
        { prop: "id", label: "更新广告组ID", "min-width": 60 },
        { prop: "conflictId", label: "冲突广告组ID", "min-width": 60 },
        { prop: "name", label: "冲突广告组名称", "min-width": 200 }
      ],
      checkRespnoseData: {},
      conflictData: [], // 冲突广告组信息
      conflictAdgroups: [],
      bIsShowConfirm: false,
      bIsLoadingConfirm: false,
      bIsShowSetConflict: false
    };
  },
  computed: {
    adgroupIds() {
      return this.adgroups
        .map((item) => {
          return item.id;
        })
        .join(",");
    },
    confirmData() {
      let data = [];
      let confimData = this.checkRespnoseData.data;
      if (this.bIsShowConfirm && confimData) {
        Object.keys(confimData).forEach((key) => {
          data.push({
            advId: key,
            adGroupId: confimData[key][0],
            content: confimData[key][1]
          });
        });
      }
      return data;
    }
  },
  methods: {
    setData(data) {
      this.checkRespnoseData = data;
      if (data.status == 702) {
        // 702展示确认弹框,多了一步确认
        this.bIsShowConfirm = true;
      } else {
        this.fConfirm();
      }
    },
    async fConfirm() {
      this.bIsLoadingConfirm = true;
      let res = await fCheckConflictAdgroup(this.adgroupIds);
      this.fHiddenConfirm();
      //有冲突广告组 （展示冲突详情
      if (res.status == 0 && res.data != null) {
        let { confirmData, adgroupArray } = this.fDealConflictData(res.data);
        this.conflictAdgroups = adgroupArray;
        this.conflictData = confirmData;
        this.bIsShowSetConflict = true;
      } else {
        // 无冲突广告组,更新投放
        this.fFlight();
      }
    },
    //不设置冲突广告组
    fNoSetConflict() {
      this.bIsShowSetConflict = false;
      this.fFlight();
    },
    //设置冲突广告组
    fSetConflict() {
      this.bIsShowSetConflict = false;
      setConflictAd(this.conflictAdgroups)
        .then((res) => {
          let msg = `自动设置冲突广告组${res.status == 0 ? "成功" : "失败"}，是否继续更新投放?`;
          this.$confirm(msg, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.fFlight();
            })
            .catch(() => {
              this.$parent.fReload();
            });
        })
        .catch(() => {
          this.$message({
            message: "自动设置冲突广告组发生异常！",
            type: "error"
          });
        });
    },
    async fFlight() {
      // 检查广告组状态
      let hasError = await this.$parent.fCheckAdGroupStatus(this.adgroupIds);
      if (hasError) {
        return;
      }
      fFlightAdgroup(this.adgroupIds)
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
              this.$parent.fReload();
            }
          });
        })
        .catch(() => {
          this.$message({
            message: "操作失败！",
            type: "error"
          });
          this.$parent.fReload();
        });
    },
    fDealConflictData(data) {
      let confirmData = [];
      let adgroupArray = [];
      Object.keys(data).forEach((key) => {
        let conflictgroupArray = [];
        let dataArr = data[key];
        if (dataArr && dataArr != null) {
          dataArr.forEach((item) => {
            confirmData.push({
              id: key,
              conflictId: item.id,
              name: item.name
            });
            conflictgroupArray.push(item.id);
          });
        }
        adgroupArray.push({ id: key, conflictgroup: conflictgroupArray.join(",") });
      });
      return {
        confirmData: confirmData,
        adgroupArray: adgroupArray
      };
    },
    fHiddenConfirm() {
      this.bIsShowConfirm = false;
      this.bIsLoadingConfirm = false;
    }
  }
};
</script>
<style lang="scss">
.flight-dia-wraper {
  .fligth-table {
    max-height: 400px;
    overflow: scroll;
  }
}
</style>
