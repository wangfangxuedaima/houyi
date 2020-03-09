/**
 * 公共配置
 * @author xiaominliu
 * @date 2019-09-26
 */
const path = require("path");

module.exports = {
  // 服务端口
  port: 9000,
  // 静态资源目录位置
  static: path.join(__dirname, "../../dist"),

  // 错误日志
  logPath: path.resolve(__dirname, "../logs/"),

  // 模板设置
  template: {
    root: path.join(__dirname, "../../dist"),
    extname: ".html",
    debug: process.env.NODE_ENV !== "production"
  }
};
