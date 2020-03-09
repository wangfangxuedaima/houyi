import { constantRouterMap, asyncRouterMap } from "@/router";
// 遍历asyncRoutes动态路由
function forSearchArr(route, modules) {
  let arrNew = [];
  for (let item of route) {
    let itemNew = { ...item }; //解决浅拷贝共享同一内存地址
    let oldPath = item.meta && item.meta.oldPath;
    if (oldPath) {
      if (modules.includes(oldPath)) {
        if (itemNew.children) {
          itemNew.children = forSearchArr(itemNew.children, modules);
        }
        arrNew.push(itemNew);
      }
    } else {
      arrNew.push(itemNew);
    }
  }
  return arrNew;
}
const permission = {
  namespaced: true,
  state: {
    routes: [],
    addRoutes: []
  },
  mutations: {
    SET_ROUTES(state, payload) {
      state.routes = [...constantRouterMap, ...payload];
      state.addRoutes = payload;
    }
  },
  actions: {
    GenerateRoutes({ commit }, { modules, menuAll }) {
      return new Promise((resolve) => {
        let routes = [];
        if (menuAll) {
          routes = asyncRouterMap;
        } else {
          routes = forSearchArr(asyncRouterMap, modules);
        }
        commit("SET_ROUTES", routes);
        resolve(routes);
      });
    }
  }
};

export default permission;
