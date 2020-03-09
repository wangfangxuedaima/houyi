const mysql = require("mysql");
const config = require("./config");

/**
 * 获取数据库连接池
 */
let ruohuaPool = mysql.createPool(config.ruohuaDataBase);
// let dataPool = mysql.createPool(config.dataDataBase);

function generateQuery(pool, sql, val) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        return reject(err);
      }
      connection.query(sql, val, (err, res) => {
        connection.release();
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  });
}
const dbUtils = {
  ruohuaPool(sql, val) {
    return generateQuery(ruohuaPool, sql, val);
  }
  // dataQuery(sql, val) {
  //   return generateQuery(dataPool, sql, val);
  // }
};

module.exports = dbUtils;
