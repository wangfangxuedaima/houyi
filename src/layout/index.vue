<template>
  <el-container class="app-wrapper">
    <el-header class="page-header" height="50px">
      <top-navmenu class="top-nav-menu"></top-navmenu>
    </el-header>
    <bread-crumb></bread-crumb>
    <el-main class="app-container">
      <page-main></page-main>
    </el-main>
  </el-container>
</template>
<script>
import topNavmenu from "./components/top-navmenu";
import PageMain from "./components/pageMain";
import BreadCrumb from "./components/breadCrumb";
export default {
  components: {
    topNavmenu,
    BreadCrumb,
    PageMain
  }
};
</script>
<style lang="scss" scoped></style>
