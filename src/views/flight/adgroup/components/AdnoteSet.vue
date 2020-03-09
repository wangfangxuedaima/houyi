<template>
  <el-dialog title="设置广告备注" :visible.sync="bIsVisible" width="500px">
    广告备注:
    <el-input v-model="adNote" placeholder="广告备注" size="small" style="width: 300px;margin-left: 5px"></el-input>
    <span slot="footer" class="dialog-footer">
      <el-button @click="bIsVisible = false" type="info" size="small" plain>取 消</el-button>
      <el-button @click="fAddAdv" :disabled="confirmDisabled || !adNote" type="primary" size="small" plain>
        确 定
      </el-button>
    </span>
  </el-dialog>
</template>
<script>
import { fAddAdvNote } from "@/api/flight/adgroup";
export default {
  data() {
    return {
      adNote: "",
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
    fAddAdv() {
      this.confirmDisabled = true;
      let data = { adNote: this.adNote };
      data.adGroupIds = this.adgroups.map((item) => {
        return item.id;
      });
      fAddAdvNote(data)
        .then((res) => {
          this.confirmDisabled = false;
          this.bIsVisible = false;
          this.adNote = "";
          this.$message({
            message: res.message || (res.status == 0 ? "设置成功" : "设置失败"),
            type: res.status == 0 ? "success" : "error"
          });
          if (res.status === 0) {
            this.$emit("reload");
          }
        })
        .catch(() => {
          this.bIsVisible = false;
          this.$message({
            message: "系统异常，请稍后重试!",
            type: "info"
          });
        });
    }
  }
};
</script>
