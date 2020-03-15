import store from "@/store";
import { getSystemRedirectPath, getTokenFromLocal, redirectToSso, setSystemRedirectPath } from "@/utils/tokenSso"; // 验权
import { Message } from "element-ui";
import Vue from "vue";
import Router from "vue-router";
import systemConfig from "../config";
import constantRouter from "./modules/constant"; // 公共路由
import flightSearch from "./modules/flightSearch"; // flightSearch
// import Monitor from './modules/monitor'; // monitor
// import probleInvest from "./modules/probleInvest"; // probleInvest
import System from "./modules/system"; // 系统管理

Vue.use(Router);

export const constantRouterMap = constantRouter;
export const asyncRouterMap = [
  ...System,
  // ...Monitor,
  ...flightSearch
  // ...probleInvest
];
const whiteList = ["/error"]; // 不重定向白名单

export const creatRouter = () => {
  const router = new Router({
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
  });
  router.beforeEach(async (to, from, next) => {
    if (to.path === "/home" && to.query.errorcode) {
      next({
        name: "error",
        replace: true,
        query: { errorcode: to.query.errorcode }
      });
      return;
    }
    if (whiteList.includes(to.path)) {
      next();
      return;
    }
    // 不需要登陆
    if (systemConfig.noNeedLogin) {
      if (store.getters.addRoutes.length === 0) {
        store.commit("user/SET_TOKEN", systemConfig.token);
        let addRoutes = await store.dispatch("permission/GenerateRoutes", {
          modules: [],
          bNoNeedLogin: systemConfig.noNeedLogin,
          asyncRouterMap
        });
        router.addRoutes(addRoutes);
        next({ ...to, replace: true });
      } else {
        next();
      }
      return;
    }
    // 用户已登陆
    if (store.getters.userInfo) {
      next();
      return;
    }

    const token = getTokenFromLocal(to);
    // token 不存在跳转sso
    if (!token) {
      // cookie中存储地址，并在sso登录成功后redirect
      setSystemRedirectPath(to.fullPath);
      redirectToSso();
      return;
    }
    // sso登陆返回后带了token
    store.commit("user/SET_TOKEN", token);
    try {
      let userInfo = await store.dispatch("user/GetUserInfo");
      let addRoutes = await store.dispatch("permission/GenerateRoutes", {
        modules: userInfo.modules,
        bNoNeedLogin: false,
        asyncRouterMap
      });
      router.addRoutes(addRoutes);
      let prePath = getSystemRedirectPath();
      if (prePath) {
        next({
          path: prePath,
          replace: true
        });
      } else {
        // 有token时导航到首页，避免token被用户看到
        if (to.query.token && to.path === "/") {
          next({
            ...to,
            path: "/",
            replace: true
          });
        } else {
          next({
            ...to,
            replace: true
          });
        }
      }
    } catch (error) {
      Message.error(error);
    }
  });
  return router;
};

export default creatRouter();
