<template>
  <el-checkbox v-model="model" v-bind="config.attrs">{{ (config.attrs && config.attrs.title) || "" }}</el-checkbox>
</template>
<script>
export default {
  props: {
    value: {
      type: [Boolean, Number, String],
      default: false
    },
    config: {
      type: Object,
      default: () => {
        return {
          type: "CheckBox",
          prop: "CheckBox",
          formItemAttrs: {
            label: "",
            rules: [
              {
                required: true,
                message: "",
                trigger: "blur"
              }
            ]
          },
          attrs: {}
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
<style>
.input-search {
  width: 140px !important;
}
</style>
