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
  },

  // ruohua数据库
  ruohuaDataBase: {
    host: "123.56.228.134",
    port: "3306",
    user: "root",
    password: "rh20200109",
    database: "ruohua",
    charset: "utf8mb4", //utf8mb4才能保存emoji
    connectionLimit: 10 //连接数量
  }
  // // 数据组数据库
  // dataDataBase: {
  //   host: "10.16.19.122",
  //   port: "9030",
  //   user: "mediaai",
  //   password: "aimedia",
  //   database: "mediaai",
  //   charset: "utf8mb4",
  //   connectionLimit: 10 //连接数量
  // }
};
