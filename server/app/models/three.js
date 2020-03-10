const superagent = require("superagent");
const fs = require("fs");
const dayjs = require("dayjs");
const csv2mysql = require("csv2mysql");
const path = require("path");
const dbUtils = require("../../db");
const csvtojson = require("csvtojson");
const csvPath = path.resolve(__dirname, "../csv/three.csv");
console.log("开始时间" + dayjs().format("YYYYMMDD-hh:mm:ss"));
let sql = `truncate table three_wf`;
dbUtils.ruohuaPool(sql);
fs.createReadStream(csvPath)
  .pipe(
    csvtojson({
      delimiter: ";"
    })
  )
  .subscribe((json) => {
    console.log(json.Categories);
    let sql = `INSERT INTO three_wf (Image, Image2) VALUES ('${json.Categories}', '${json["Product Url"]}')`;
    dbUtils.ruohuaPool(sql);
  })
  .on("done", () => {
    console.log("完成");
  });
