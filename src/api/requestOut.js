import systemConfig from "../config";
import axios from "axios";
// import { Message } from "element-ui";
// import store from "../store";

// 设置跨域传递cookie
// axios.defaults.withCredentials = true;
// 创建axios实例
let api = systemConfig.reqBaseUrlOut;
const service = axios.create({
  baseURL: api,
  timeout: 60000 // 请求超时时间
});

// respone拦截器
service.interceptors.response.use(
  (response) => {
    if (!response.data) {
      v.$message({
        message: "操作失败!未接收到正常的返回数据",
        type: "error",
        duration: 5 * 1000
      });
      return Promise.reject(new Error("未接收到正常的返回数据"));
    }
    let res = response.data;
    return res;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default service;
