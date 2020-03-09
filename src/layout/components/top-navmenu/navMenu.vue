<template>
  <div :class="menuClass">
    <!-- 最后一级菜单 -->
    <el-menu-item v-if="!item.children && item.meta" :index="item.basePath">
      <i :class="item.meta.icon"></i>
      <span slot="title">{{ item.meta.title }}</span>
    </el-menu-item>
    <!-- 此菜单下还有子菜单 -->
    <el-submenu
      v-if="item.children && item.meta"
      :index="item.basePath"
      popper-class="nav-menu-pop"
      popper-append-to-body
    >
      <template slot="title">
        <i :class="item.meta.icon"></i>
        <span slot="title">{{ item.meta.title }}</span>
      </template>
      <!-- 递归 -->
      <nav-menu
        v-for="(item, index) in item.children"
        :key="index"
        :index="index"
        :item="item"
        :menuClass="'nav-menu-sub'"
      ></nav-menu>
    </el-submenu>
  </div>
</template>
<script>
export default {
  name: "navMenu",
  props: {
    item: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      default: -1
    },
    menuClass: {
      type: String,
      default: "nav-menu-one"
    }
  }
};
</script>

<style lang="scss">
.nav-menu-one {
  .el-menu-item,
  .el-submenu {
    min-width: 100px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    &.is-active {
      background: #ba3243 !important;
      .el-submenu__title {
        background: #ba3243 !important;
      }
    }
  }
}

.el-menu--popup {
  max-width: 735px;
  margin-top: 0 !important;
  padding: 0 !important;
  .nav-menu-sub {
    box-sizing: border-box;
    width: 105px;
    text-align: center;
  }
  .el-menu-item {
    height: 45px !important;
    line-height: 45px !important;
    font-size: 13px;
    &.is-active {
      background: #ba3243 !important;
    }
  }
}
.nav-menu-one,
.nav-menu-sub,
.log-menu {
  display: inline-block;
  border-right: 1px solid #a82b3a;
}

.el-submenu__title {
  height: 50px !important;
  line-height: 50px !important;
  i {
    color: #fff !important;
  }
}
.el-menu-item {
  border-bottom: 0 !important;
}
* {
  outline: none;
}
</style>
