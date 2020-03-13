let systemConfigMap = {
  development: {
    systemName: "troubleShooting",
    ssoAppId: "78401273-f7b5-42fd-866f-3d2c80b0ebc8",
    noNeedLogin: true,
    checkAuth: false,
    reqBaseUrl: "http://localhost:9000/",
    reqBaseUrlOut: "http://10.18.33.131:9500"
  },

  test: {
    systemName: "troubleShooting",
    ssoAppId: "78401273-f7b5-42fd-866f-3d2c80b0ebc8",
    noNeedLogin: true,
    checkAuth: true,
    reqBaseUrl: "/api"
  },
  production: {
    systemName: "troubleShooting",
    ssoAppId: "9c407383-7cb2-46e2-9dfd-f14820bbae46",
    noNeedLogin: true,
    checkAuth: true,
    reqBaseUrl: "/api",
    token: ""
  }
};
let env = process.env.VUE_APP_CURRENTMODE;
let systemConfig = systemConfigMap[env];
console.log("systemConfig", systemConfig);

export default systemConfig;
