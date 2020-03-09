<template>
  <el-cascader v-model.trim="model" v-bind="config.attrs" class="top_search_cascader"></el-cascader>
</template>
<script>
export default {
  props: {
    value: { type: [String, Array] },
    config: {
      type: Object,
      default: () => {
        return {
          type: "Cascader",
          prop: "cascader",
          formItemAttrs: {
            label: "cascader",
            rules: [
              {
                required: true,
                message: "请输入cascader类型",
                trigger: "blur"
              }
            ]
          },
          attrs: {
            placeholder: "请输入",
            clearable: true
          }
        };
      }
    }
  },
  computed: {
    model: {
      get: function() {
        return this.value;
      },
      set: function(val) {
        this.$emit("input", val);
      }
    }
  }
};
</script>
<style></style>
