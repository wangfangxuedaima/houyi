<template>
  <el-dialog title="复制广告组" :visible.sync="bIsVisible" width="400px" class="copy-inner-dia">
    <div>
      <label>复制广告</label>
      <el-checkbox v-model="isCopyMaterial"></el-checkbox>
    </div>
    <div class="project-number">
      <label>执行单号</label>
      <el-input
        v-model="projectNumber"
        size="small"
        style="width: 230px"
        :class="{ 'error-no-projectnumber': !projectNumber }"
        readonly
      ></el-input>
    </div>
    <div>
      <label>广告组后缀</label>
      <el-input v-model="suffix" size="small" style="width: 230px"></el-input>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="bIsVisible = false" type="info" size="small" plain>取 消</el-button>
      <el-button @click="fCoppyInner" :disabled="confirmDisabled" type="primary" size="small" plain>
        确 定
      </el-button>
    </span>
  </el-dialog>
</template>
<script>
import { fCoppyInner } from "@/api/flight/adgroup";
export default {
  inject: ["routerRefresh"], //在子组件中注入在父组件中创建的属性
  data() {
    return {
      isCopyMaterial: true,
      suffix: "",
      confirmDisabled: false
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
    },
    // 执行单号
    projectNumber: {
      type: String,
      default: ""
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
    fCoppyInner() {
      if (!this.projectNumber) {
        return;
      }
      this.confirmDisabled = true;
      let adgroupIds = this.adgroups.map((item) => {
        return item.id;
      });
      fCoppyInner({
        agids: adgroupIds.join(","),
        projectNumber: this.projectNumber,
        copymaterial: this.isCopyMaterial,
        groupSuffix: this.suffix
      }).then((res) => {
        this.confirmDisabled = false;
        this.bIsVisible = false;
        if (res.status !== 0) {
          this.$message({
            message: res.message || "复制失败",
            type: "error"
          });
          return;
        }
        this.$message({
          message: "复制成功",
          type: "success"
        });
        // 清空数据
        this.suffix = "";
        this.isCopyMaterial = true;
        // 刷新
        this.$router.push({
          path: this.$router.path,
          query: { ids: res.data.ids.join(",") }
        });
        this.routerRefresh();
      });
    }
  }
};
</script>
<style scoped lang="scss">
.copy-inner-dia {
  .project-number {
    margin: 10px 0;
  }
  label {
    width: 85px;
    display: inline-block;
  }
  .error-no-projectnumber {
    border: 1px solid red;
  }
}
</style>
