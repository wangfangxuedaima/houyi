const superagent = require("superagent");
const fs = require("fs");
const dayjs = require("dayjs");
const csv2mysql = require("csv2mysql");
const path = require("path");
const dbUtils = require("../../db");
const csvPath = path.resolve(__dirname, "../csv/three.csv");
console.log("开始时间" + dayjs().format("YYYYMMDD-hh:mm:ss"));
// for (let i = 0; i < 30; i++) {
//   let writeSteam = fs.createWriteStream(csvPath);
//   superagent
//     .get("http://pim.coltorti.it:8080/csvExport/export/allProducts.csv")
//     .auth("vip", "05mDw01F")
//     .pipe(writeSteam)
//     .on("finish", async function() {
//       console.log(dayjs().format("YYYYMMDD-hh:mm:ss") + "导出csv完成");
//       let sql = `truncate table three`;
//       await dbUtils.ruohuaPool(sql);
//       csv2mysql(
//         {
//           host: "123.56.228.134",
//           port: "3306",
//           user: "root",
//           password: "rh20200109",
//           database: "ruohua",
//           table: "three",
//           csv: {
//             delimiter: ";"
//           }
//         },
//         csvPath
//       )
//         .then(function() {
//           console.log("写入数据库成功");
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     })
//     .on("error", (err) => {
//       console.log("读取", err.stack);
//     });
// }

// let sql = `truncate table three`;
// dbUtils.ruohuaPool(sql);
