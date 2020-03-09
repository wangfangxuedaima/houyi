import systemConfig from "../config";
import axios from "axios";
import { Message } from "element-ui";
import { redirectToSso } from "@/utils/tokenSso"; // 验权
import qs from "qs";
import { isString } from "lodash";
// 设置跨域传递cookie
axios.defaults.withCredentials = true;
// 创建axios实例
console.log(systemConfig.reqBaseUrl);

let api = systemConfig.reqBaseUrl || "";
const service = axios.create({
  baseURL: api,
  timeout: 60000 // 请求超时时间
});

// request拦截器
service.interceptors.request.use(
  (config) => {
    let { method, dataType } = config;
    method = method.toLowerCase();
    if (method === "post" && dataType === "formData") {
      config.data = qs.stringify(config.data, { arrayFormat: "repeat" });
      config.headers = { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" };
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
    if (!response.data || response.status != 200) {
      Message({
        message: "请求出错了",
        type: "error",
        duration: 5 * 1000
      });
      return;
    }
    let res = response.data;
    if (isString(res) && res.includes("出错啦")) {
      return Promise.reject("请求出错了");
    }
    return res;
  },
  (error) => {
    Message({
      message: "请求出错了",
      type: "error",
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default service;
