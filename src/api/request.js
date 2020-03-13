import systemConfig from "../config";
import axios from "axios";
import { Message } from "element-ui";
import store from "../store";

// 设置跨域传递cookie
// axios.defaults.withCredentials = true;
// 创建axios实例
let api = systemConfig.reqBaseUrl;
const service = axios.create({
  baseURL: api,
  timeout: 60000 // 请求超时时间
});

// request拦截器
service.interceptors.request.use(
  (config) => {
    let token = store.getters.token;
    if (token) {
      // 让每个请求携带自定义token 请根据实际情况自行修改
      config.headers.common["Authorization"] = "Bearer " + token;
      // config.headers['X-Token'] = store.getters.token
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

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
    try {
      if (res instanceof Blob) {
        res.filename = response.headers["content-disposition"];
        return res;
      }
    } catch (e) {
      let _msg = "无法解析服务端的返回值，可能后台出现了问题，请联系管理员";
      Message({
        message: _msg,
        type: "error",
        duration: 5 * 1000
      });
      return Promise.reject(new Error(e.message));
    }
    console.log(res);

    if (res.data.code !== 200) {
      let msg = res.message || "操作失败!";
      Message({
        message: msg,
        type: "error",
        duration: 5 * 1000
      });
      throw new Error(msg);
    }
    return res;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default service;
