<template>
  <div :class="classObject">
    <div v-for="(item, index) in opBtns" :key="index" class="op-btn">
      <div v-has="item.pemissionUrl">
        <!-- popover -->
        <el-popover v-if="item.popover" v-model="item.popover.isVisible" v-bind="item.popover.attrs">
          <div v-if="item.popover.info">{{ item.popover.info }}</div>
          <slot v-if="item.popover.slotName" :name="item.popover.slotName"></slot>
          <el-button slot="reference" v-bind="item.attrs">
            {{ item.name }}
            <i v-if="item.rightIcon" :class="item.rightIcon"></i>
          </el-button>
        </el-popover>
        <!-- 普通 -->
        <el-button v-else v-bind="item.attrs" @click="fOperate(item, index)">
          {{ item.name }}
          <i v-if="item.rightIcon" :class="item.rightIcon"></i>
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    // align 按钮对齐方式: left ,center, right
    align: {
      type: String,
      default: "center"
    },
    // isFloat 是否浮动， 如果不浮动，则固定在页面底部
    isFloat: {
      type: Boolean,
      default: true
    },
    buttons: {
      type: Array,
      default: () => {
        return [
          {
            name: "test",
            disabled: false,
            type: "success",
            icon: "",
            hidden: true,
            popover: {
              info: "", // 仅仅用于展示文字，不可和slotName同时使用
              slotName: "",
              isVisible: false,
              width: "400",
              trigger: "hover",
              placement: "top"
            }
          }
        ];
      }
    }
  },
  computed: {
    classObject() {
      return {
        op: true,
        float: this.isFloat,
        [this.align]: true
      };
    },
    opBtns() {
      let btns = (this.buttons || []).map((btn) => {
        let attrs = { size: "small", type: "primary", plain: true, ...btn.attrs };
        btn.attrs = attrs;
        return btn;
      });
      return btns.filter((v) => !v.hidden);
    }
  },
  methods: {
    fOperate(item, index) {
      let btn = {
        ...item,
        index: index
      };
      this.$emit("operate", btn);
    }
  }
};
</script>
<style lang="scss" scoped>
.op {
  z-index: 99;
  margin-top: 20px;
  background: rgba(255, 255, 255, 0.6);
  &.float {
    position: sticky;
    bottom: 20px;
  }
  &.left {
    text-align: left;
  }
  &.center {
    text-align: center;
  }
  &.right {
    text-align: right;
  }
  .op-btn {
    display: inline-block;
    margin-right: 10px;
  }
}
</style>
