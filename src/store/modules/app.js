import systemConfig from "../../config";
const app = {
  namespaced: true,
  state: {
    opened: sessionStorage.getItem("open") ? sessionStorage.getItem("open") : "false",
    loginTime: 0,
    serverTime: 0,
    checkAuth: systemConfig.checkAuth
  },
  mutations: {
    SET_OPENED(state, payload) {
      state.opened = String(payload);
      sessionStorage.setItem("open", payload);
    },
    INIT_SERVER_TIME(state, value) {
      state.serverTime = value;
      state.loginTime = Date.now();
    }
  },
  actions: {}
};

export default app;
