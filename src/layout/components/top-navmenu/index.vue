<template>
  <el-scrollbar>
    <el-menu
      router
      :default-active="$route.path"
      background-color="#cf4858"
      text-color="#fff"
      active-text-color="#ffe252"
      mode="horizontal"
      @select="fSelect"
      overflow-x:
      scroll
    >
      <el-menu-item class="log-menu normal-bgcolor">
        <el-image class="logo" src="http://10.18.38.44:8070/static/images/logo.png" fit="fit"></el-image>
      </el-menu-item>
      <nav-menu v-for="(item, index) in pageRoutes" :key="index" :item="item"></nav-menu>
      <el-menu-item class="userinfo-menu normal-bgcolor">
        <span class="user-name">{{ userName }}</span>
        <a class="logout-out" href="/j_logout" target>退出</a>
      </el-menu-item>
      <el-submenu class="screen-cut-menu" index="screen">
        <template slot="title">
          <i class="el-icon-document"></i>
        </template>
        <el-menu-item class="nav-menu-sub" :index="'/p/appscreenshot/'" v-has="'/p/appscreenshot/'">
          <span @click="goto('/p/appscreenshot/')">移动app截屏</span>
        </el-menu-item>
        <el-menu-item class="nav-menu-sub" :index="'/p/bookpkg/compare/view'" v-has="'/p/bookpkg/compare/view'">
          <span @click="goto('/p/bookpkg/compare/view')">排期包对比</span>
        </el-menu-item>
      </el-submenu>
      <el-menu-item class="search-menu normal-bgcolor" index>
        <el-input placeholder="请输入内容" v-model="searchVal" size="small">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-menu-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import navMenu from "./navMenu";
import store from "@/store";
export default {
  components: { navMenu },
  data() {
    return {
      searchVal: "",
      origin: window.location.origin
    };
  },
  computed: {
    userName() {
      return store.getters.userName;
    },
    pageRoutes() {
      let getShowRouters = (routes, basePath) => {
        let newRouters = [];
        basePath = basePath ? `${basePath}/` : "";
        routes.forEach((item) => {
          if (!item.hidden) {
            let parentPath = item.redirect ? item.redirect : `${basePath}${item.path}`;
            let newItem = { ...item, basePath: parentPath };
            if (newItem.children) {
              let subChildren = getShowRouters(newItem.children, newItem.redirect ? newItem.path : newItem.basePath);
              newItem.children = subChildren.length === 0 ? null : subChildren;
            }
            newRouters.push(newItem);
          }
        });
        return newRouters;
      };
      let routes = store.getters.routes || [];
      console.log("originRoute", routes);
      let dealRouters = getShowRouters(routes);
      console.log("dealRouters", dealRouters);
      return dealRouters;
    },
    newToOldRouteMap() {
      let map = {};
      let dealRoutes = (routes) => {
        routes.forEach((item) => {
          map[item.basePath] = item.meta && item.meta.oldPath;
          if (item.children) {
            dealRoutes(item.children);
          }
        });
      };
      dealRoutes(this.pageRoutes);
      return map;
    }
  },
  methods: {
    fSelect(path) {
      let oldUrl = this.newToOldRouteMap[path] || "";
      console.log(oldUrl);
      // console.log(this.newToOldRouteMap);
      if (oldUrl && !["/p/advproject/list", "/p/viewflight/view"].includes(oldUrl)) {
        location.replace(`${location.origin}${oldUrl}`);
      }
    },
    goto(url) {
      location.replace(`${location.origin}/${url}`);
    }
  }
};
</script>
<style lang="scss">
.top-nav-menu {
  .search-menu,
  .screen-cut-menu,
  .userinfo-menu {
    float: right !important;
  }
  .normal-bgcolor {
    background: #cf4858 !important;
  }
  .log-menu {
    .logo {
      width: 142px;
      top: 5px;
    }
  }
  .search-menu {
    .el-input__inner {
      border-radius: 30px;
      background: #ba3243;
      color: #fff;
    }
  }
  .screen-cut-menu {
    .el-submenu__title {
      padding: 0 5px;
    }
  }
  .userinfo-menu {
    .logout-out,
    .user-name {
      margin-right: 15px;
      font-size: 12px;
    }
    .logout-out {
      border-bottom: 1px solid#fff;
    }
  }
}
</style>
