const getters = {
  app: (state) => state.app,
  addRoutes: (state) => state.permission.addRoutes,
  userName: (state) => state.user.userName,
  userInfo: (state) => state.user.userInfo,
  routes: (state) => state.permission.routes
};
export default getters;
