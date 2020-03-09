<template>
  <div class="bread">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- <el-breadcrumb-item :to="{ path: '/' }" class="el-icon-s-home">首页</el-breadcrumb-item> -->
      <template v-for="(item, index) in breadList">
        <el-breadcrumb-item v-if="index !== 0" :to="item.redirect || item.path" :key="index">
          {{ item.meta.title }}
        </el-breadcrumb-item>
        <el-breadcrumb-item v-else :to="''" :key="index">{{ item.meta.title }}</el-breadcrumb-item>
      </template>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  data() {
    return {
      breadList: []
    };
  },
  watch: {
    $route: {
      handler(route) {
        let allList = route.matched.filter((item) => {
          if (item.meta && item.meta.title && !item.meta.noBread) {
            return true;
          }
        });
        console.log(allList);
        this.breadList = allList;
      },
      immediate: true
    }
  }
};
</script>
<style lang="scss" scoped>
.bread {
  float: left;
  margin: 10px 0 5px;
  border-bottom: 1px solid #dcd5d5;
  .el-breadcrumb {
    margin-left: 15px;
    height: 20px;
    font-size: 12px;
  }
}
</style>
