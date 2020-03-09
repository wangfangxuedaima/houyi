import store from "@/store";
import Vue from "vue";
import Router from "vue-router";
import { redirectToSso, getSSoToken } from "@/utils/tokenSso"; // 验权
import { Message } from "element-ui";
import systemConfig from "../config";

import constantRouter from "./modules/constant"; // 公共路由
// import homeRouter from "./modules/home";
import systemRouter from "./modules/system";
import resourceRouter from "./modules/resource";
import scheduleRouter from "./modules/schedule";
import flightRouter from "./modules/flight";
import amountRouter from "./modules/amount";
import otherRouter from "./modules/other";

const appPrefix = "";

Vue.use(Router);

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

let getPrefixRouter = (originalRouter) => {
  return originalRouter.map((router) => {
    let newRouter = {
      ...router,
      path: `${appPrefix}${router.path}`
    };
    if (newRouter.redirect) {
      newRouter.redirect = `${appPrefix}${newRouter.redirect}`;
    }
    return newRouter;
  });
};

export const constantRouterMap = getPrefixRouter([...constantRouter, ...otherRouter]);

export const asyncRouterMap = getPrefixRouter([
  // ...homeRouter,
  ...systemRouter,
  ...resourceRouter,
  ...scheduleRouter,
  ...flightRouter,
  ...amountRouter
]);

const router = new Router({
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
});
router.beforeEach(async (to, from, next) => {
  // 不需要登陆;
  if (systemConfig.noNeedLogin) {
    if (store.getters.addRoutes.length === 0) {
      let addRoutes = await store.dispatch("permission/GenerateRoutes", {
        modules: [],
        menuAll: true
      });
      router.addRoutes(addRoutes);
      next({
        ...to,
        replace: true
      });
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
  // token 不存在跳转sso
  if (!getSSoToken("sso_token")) {
    redirectToSso();
    return;
  }
  try {
    let userInfo = await store.dispatch("user/GetUserInfo");
    let addRoutes = await store.dispatch("permission/GenerateRoutes", {
      modules: userInfo.modules,
      menuAll: false
    });
    router.addRoutes(addRoutes);
    next({
      ...to,
      replace: true
    });
  } catch (error) {
    Message.error(error);
  }
});

export default router;
