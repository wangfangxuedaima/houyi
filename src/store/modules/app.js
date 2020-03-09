const app = {
  namespaced: true,
  state: {
    loginTime: 0,
    serverTime: 0
  },
  mutations: {
    INIT_SERVER_TIME(state, value) {
      state.serverTime = value;
      state.loginTime = Date.now();
    }
  }
};

export default app;
