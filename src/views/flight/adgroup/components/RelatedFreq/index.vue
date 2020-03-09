<template>
  <el-dialog title="关联频次" :visible.sync="bIsVisible" width="1000px" class="relate-freq-dia">
    <el-tabs v-model="activeTab">
      <el-tab-pane v-for="(item, index) in tabList" :key="index" :label="item.name" :name="item.prop">
        <component :is="item.prop" :adgroups="adgroups" :projectNumber="projectNumber" @reload="fReload" />
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script>
import createFreq from "./createFreq";
import chooseFreq from "./chooseFreq";

export default {
  components: { createFreq, chooseFreq },
  data() {
    return {
      activeTab: "createFreq",
      tabList: [
        { name: "新建频次", prop: "createFreq" },
        { name: "选择频次", prop: "chooseFreq" }
      ]
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
    type: {
      type: Number,
      default: 1 //1 组频次 2 物料频次 3 推送频次
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
    fReload() {
      this.bIsVisible = false;
      this.$emit("reload");
    },
    fShow() {
      //   console.log(this.$refs);
      //   console.log(this.$refs.chooseFreq);
      //   this.$refs.chooseFreq.fSearch();
    }
  }
};
</script>
<style lang="scss">
.relate-freq-dia {
  .el-dialog__header {
    padding: 15px 15px 0;
  }
  .el-tabs__content {
    height: 450px;
    overflow: scroll;
    .create-view-wrap {
      width: inherit;
    }
  }
}
</style>
