let systemConfigMap = {
  development: {
    systemName: "mango-new",
    ssoAppId: "39fa3df0-8892-417a-bc73-f97e89ccfe6b",
    noNeedLogin: true,
    reqBaseUrl: "/api",
    ssoP: "http://mangotest.aty.sohuno.com/",
    token: ""
  },

  test: {
    systemName: "mango-new",
    ssoAppId: "78401273-f7b5-42fd-866f-3d2c80b0ebc8",
    noNeedLogin: true,
    reqBaseUrl: "/api",
    token:
      "eyJhbGciOiJIUzUxMiJ9.eyJleHAiOjE1NzQzNDM0NjYsInVzZXIiOiJ7XCJpZFwiOjIsXCJyb2xlc1wiOltcIlNZU1RFTV9NQU5BR0VSXCJdLFwidXNlcm5hbWVcIjpcInhpYW9taW5saXVAc29odS1pbmMuY29tXCJ9In0.c2L4HmJT3gzNwnuXSKUL8GEhRDRakpgxDtNj-W5g8ZU3qnn-cNDVfJ7xDZY0tah5r6wRaCJMDmqNC0sbvYgmNQ"
  },
  production: {
    systemName: "mango-new",
    ssoAppId: "9c407383-7cb2-46e2-9dfd-f14820bbae46",
    noNeedLogin: true,
    reqBaseUrl: "/api",
    token: ""
  }
};
let env = process.env.VUE_APP_CURRENTMODE;
let systemConfig = systemConfigMap[env];
console.log("systemConfig", systemConfig);
export default systemConfig;
