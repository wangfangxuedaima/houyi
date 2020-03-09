import { getSystemUserInfo } from "@/api/system/user";
import store from "@/store";
import { logoutSso } from "@/utils/tokenSso"; // 验权
import { newRouterMap } from "@/router";

const user = {
  namespaced: true,
  state: {
    userName: "",
    userInfo: "",
    oldModuleUrls: []
  },
  mutations: {
    SET_NAME(state, payload) {
      state.userName = payload;
    },
    SET_USER_INFO(state, payload) {
      state.userInfo = payload;
    },
    SET_OLD_MODULE_URLS(state, payload) {
      state.oldModuleUrls = payload;
    }
  },
  actions: {
    GetUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getSystemUserInfo()
          .then((userInfo) => {
            let userModules = userInfo.modules;
            let oldModuleUrls = userModules.map((item) => {
              return item.url;
            });
            // console.log(oldModuleUrls);
            userInfo.modules = oldModuleUrls;
            let time = new Date(userInfo.currentTimeMillis).getTime() || Date.now(); // 没有currentTimeMillis
            store.commit("app/INIT_SERVER_TIME", time);
            commit("SET_USER_INFO", userInfo);
            commit("SET_OLD_MODULE_URLS", oldModuleUrls);
            commit("SET_NAME", userInfo.username);
            resolve(userInfo);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    LoginOut({ commit }) {
      commit("SET_USER_INFO", null);
      logoutSso();
    }
  }
};

export default user;
